import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton,
    Stack,
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import useInput from "../../../../customHooks/useInput";
import useSelect from "../../../../customHooks/useSelect";
import Usuario from "../../../../Models/Usuario";
import Toast from "../../../../utils/toastUtil";
import {useAuthContext} from "../../../../auth/useAuthContext";
import moment from "moment/moment";
import {useEffect, useState} from "react";
import Routers from "../../../../Models/Routers";
import {cadenaAleatoria, uploadImg} from "../../../../utils/utils";
import {Icon} from "@iconify/react";
import ItemsSims from "./ItemsSims";
import useInputGroup from "../../../../customHooks/useInputGroup";
import MyDropzone from "../../../../components/MyDropzone";
import DocumentViewer from "../../../../components/DocumentosViewer";

const ModalRoute = ({config, router, setConfig, setData}) => {
    const {sesion} = useAuthContext()
    ModalRoute.propTypes = {
        config: PropTypes.object,
        router: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }
    const [disabledSave, setDisabledSave] = useState(false)
    const [codigo, inputCodigo, setCodigo, setInvalidCodigo, , , setIsDisabledCodigo] = useInputGroup({
        placeholder: "Código de pago", onClick: () => {
            setCodigo('')
            Toast.Waiting('Buscando...')
            Routers.obtenerCodigo().then(response => {
                const {label} = response.data.obtenerCodigoPago
                setCodigo(label)
                Toast.Remove()
            })
        }
    })
    const [imei, inputImei, setImei, setInvalidImei, ,] = useInput({
        placeholder: "IMEI/ID",
    })
    const [marca, inputMarca, setMarca, setInvalidMarca, ,] = useInput({
        placeholder: "Marca",
    })
    const [modelo, inputModelo, setModelo, setInvalidModelo, ,] = useInput({
        placeholder: "Modelo",
    })
    const [sede, selectSede, setSede, setInvalidSedes, setOptionSedes, ,] = useSelect({
        placeholder: 'Sede'
    })
    const [fecha, inputFecha, setFecha, setInvalidFecha, ,] = useInput({
        placeholder: "Fecha de Compra", typeState: 'date', initialState: moment().format('YYYY-MM-DD')
    })
    const [precio, inputPrecio, setPrecio, setInvalidPrecio, ,] = useInput({
        placeholder: "Precio Servicio (S/.)", typeState: 'number'
    })
    const [detalle, setDetalle] = useState([]);
    const [views, setViews] = useState([]);
    const [bloquear, setBloquear] = useState(false)
    const [invalidSims, setInvalidSims] = useState(false)
    const [nombre_file, setNombreFile] = useState(null)

    const save = async () => {
        Toast.Waiting('Guardando...')
        let object = {
            imei, marca, modelo, sede_id: sede, nombre_file,
            fecha_compra: fecha, chips: views, codigo, precio_servicio: String(precio)
        }
        if (router.id) object = {...object, id: router.id}
        try {
            const {data} = await Routers.createOrUpdateRouters(object)
            const newRouters = data.createOrUpdateRouters
            if (router.id) {
                setData(prev => prev.map(element => element.id === router.id ? {...newRouters} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                return
            }
            setData(prev => [{...newRouters}, ...prev])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
        } catch (e) {
            Toast.Remove()
            Toast.Error(e.message)
        }
    }
    useEffect(() => {
        setOptionSedes([])
        Usuario.allSedes().then(response => {
            const {allSedes} = response.data
            const options = []
            for (const element of allSedes) {
                options.push({value: element.id, label: element.nombre})
            }
            setOptionSedes(options)
        })
    }, [])
    useEffect(() => {
        //producto, imei, marca, modelo, sede_id, nro_sim, fecha_compra
        setImei(router.imei ?? '')
        setMarca(router.marca ?? '')
        setModelo(router.modelo ?? '')
        setSede(router.sede_id ?? sesion.sede_seleccionada ?? '')
        setFecha(router.fecha_compra ?? moment().format('YYYY-MM-DD'))
        setPrecio(router.precio_servicio ?? '')
        setCodigo(router.codigo ?? '')
        setIsDisabledCodigo(!!router.codigo)
        setViews([])
        setDetalle([])
        if (router.chips) {
            const viewsNew = [], detalleNew = []
            for (const element of router.chips) {
                viewsNew.push({...element, old: true})
                detalleNew.push(element.id)
            }
            setViews(viewsNew)
            setDetalle(detalleNew)
        } else agregar()
    }, [router])
    useEffect(() => {
        const invalidImei = imei === ''
        const invalidMarca = marca === ''
        const invalidModelo = modelo === ''
        const invalidSede = sede === ''
        const invalidFecha = fecha === ''
        const invalidCodigo = codigo === ''
        const invalidPrecio = precio === ''

        setInvalidImei(invalidImei)
        setInvalidMarca(invalidMarca)
        setInvalidSedes(invalidSede)
        setInvalidModelo(invalidModelo)
        setInvalidFecha(invalidFecha)
        setInvalidCodigo(invalidCodigo)
        setInvalidPrecio(invalidPrecio)
        setDisabledSave(invalidFecha || invalidSede || invalidModelo || invalidMarca || invalidImei || invalidPrecio || invalidCodigo)
    }, [imei, marca, modelo, sede, fecha, codigo, precio])
    const agregar = () => {
        const id = cadenaAleatoria(8);
        setViews((prevState) => [
            ...prevState,
            {
                id, old: false
            },
        ]);
        setDetalle((prevState) => [...prevState, id]);
    }
    useEffect(() => {
        const invalidActivo = views.some(element => (element.chip !== '' && element.activo && element.usado) || (element.chip === '' && !element.activo && !element.usado))
        const invalidSave = views.some(element => element.invalid)
        setInvalidSims(invalidSave)
        setBloquear(!invalidActivo)
    }, [views])
    const onDrop = accepted => {
        uploadImg(accepted[0], 'multimedia', null)
            .then(response => response.json())
            .then(({data}) => {
                setNombreFile(data.name)
            })
            .catch(({message}) => {
                Toast.Error(message, {autoClose: 4000})
            })
    }
    const [documentos, setDocumentos] = useState([])
    const [configView, setConfigView] = useState(false)

    const handleIconClick = (nombre, url) => {
        setDocumentos([{nombre, url}])
        setConfigView(true)
    }

    return (
        <Dialog open={config.isOpen} fullWidth
                maxWidth="md">
            <DialogTitle>
                {router?.id ? 'Editar Router' : 'Nuevo Router'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputImei}
                    </FormControl>
                    <FormControl style={{flex: 1}}>
                        {inputMarca}
                    </FormControl>

                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 1}}>
                        {inputModelo}
                    </FormControl>
                    <FormControl style={{flex: 1}}>
                        {inputCodigo}
                    </FormControl>
                    <FormControl style={{flex: 1}}>
                        {inputPrecio}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputFecha}
                    </FormControl>
                    <FormControl style={{flex: 1}}>
                        {selectSede}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}}
                       style={{paddingBottom: 10, paddingTop: 5, paddingLeft: 25, paddingRight: 25}}>
                    <FormControl style={{
                        flex: 2,
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        paddingLeft: 20,
                        paddingRight: 20
                    }}>
                        <Stack direction={{xs: 'column', sm: 'row'}}
                               style={{paddingBottom: 10, paddingTop: 5, paddingLeft: 10, paddingRight: 10}}
                               spacing={2}>
                            <FormControl style={{flex: 14}}>
                                <MyDropzone onDrop={onDrop} placeholder="Foto Router"/>
                            </FormControl>
                            {router?.id_file && <FormControl style={{flex: 1, paddingTop: '2%'}}>
                                <IconButton
                                    title="Ver detalle"
                                    component="label"
                                    onClick={() => handleIconClick(`Router ${router.imei}`, router.id_file)}
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                    }}
                                >
                                    <Icon
                                        icon="mdi:eye"
                                        title="Ver detalle"
                                        style={{
                                            fontSize: 18,
                                            color: 'inherit'
                                        }}
                                    />
                                </IconButton>
                            </FormControl>}
                        </Stack>
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 3, border: '1px solid #ccc', borderRadius: '8px', padding: '10px'}}>

                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Typography variant="h10" gutterBottom>
                                Datos Sim-Card
                            </Typography>
                        </div>
                        {bloquear && <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                style={{margin: 3}}
                                onClick={() => agregar()}
                            >
                                <Icon icon="mdi:plus-circle"/> Agregar
                            </Button>
                        </div>}
                        <div style={{justifyContent: 'center'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            className="align-top"
                                            style={{margin: 0, padding: 0, textAlign: 'center'}}
                                        >
                                            Sim-Card
                                        </TableCell>
                                        <TableCell
                                            className="align-top"
                                            style={{margin: 0, padding: 0, textAlign: 'center'}}
                                        >
                                            Estado
                                        </TableCell>
                                        <TableCell
                                            className="align-top"
                                            style={{margin: 0, padding: 0, textAlign: 'center'}}
                                        >
                                            Detalle
                                        </TableCell>
                                        <TableCell className="align-top"
                                                   style={{margin: 0, padding: 0, textAlign: 'center'}}>
                                            ACCIONES
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        detalle.map(element => {
                                            const view = views.find(({id}) => id === element);
                                            return (
                                                <ItemsSims key={view.id} setDetalle={setDetalle} sim={view}
                                                           setViews={setViews} views={views} detalle={detalle}/>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </FormControl>

                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave || invalidSims}
                    onClick={() => save()}
                >
                    Guardar
                </LoadingButton>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        setConfig({...config, isOpen: false})
                    }}
                >
                    Cancelar
                </Button>
            </DialogActions>
            <DocumentViewer config={configView} setConfig={setConfigView} documentos={documentos}/>
        </Dialog>
    )
}
export default ModalRoute