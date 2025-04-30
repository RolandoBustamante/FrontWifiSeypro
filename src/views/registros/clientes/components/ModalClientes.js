import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton, Stack,
    Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import useInput from "../../../../customHooks/useInput";
import Usuario from "../../../../Models/Usuario";
import useInputGroup from "../../../../customHooks/useInputGroup";
import Toast from "../../../../utils/toastUtil";
import useSelect from "../../../../customHooks/useSelect";
import {Icon} from '@iconify/react';

import {departamentos, distritos, paisesSudamerica, provincias} from "../../../../utils/constantes";
import {useEffect, useState} from "react";
import {cadenaAleatoria, uploadImg} from "../../../../utils/utils";
import ItemsTelefono from "./ItemsTelefono";
import Clientes from "../../../../Models/Clientes";
import MyDropzone from "../../../../components/MyDropzone";
import DocumentViewer from "../../../../components/DocumentosViewer";

const ModalClientes = ({config, cliente, setConfig, setData}) => {
    ModalClientes.propTypes = {
        config: PropTypes.object,
        cliente: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }
    const [nombres, inputNombres, setNombres, setInvalidNombres, , ] = useInput({
        placeholder: "Nombres y apellidos/Razón social",
    })
    const [dni, inputDni, setDNI, setInvalidDni, , ] = useInputGroup({
        placeholder: "Documento de identidad", onClick: () => {
            setNombres('')
            Toast.Waiting('Buscando...')
            Usuario.consultDNIRUC(dni)
                .then(response => {
                    const {data, success} = response.data.consultDNIRUC.data
                    if(!success){
                        Toast.Remove()
                        Toast.Warning(data.error ?? 'No se Encontraron datos')
                        return
                    }
                    if (!data.error) {
                        setNombres(data.datos ?? '')
                        Toast.Remove()
                        return
                    }
                    Toast.Remove()
                    Toast.Warning(data.error ?? 'No se Encontraron datos')
                })
        }
    })
    const [departamento, selectDepartamento, setDepartamento, setInvalidDepartamento] = useSelect({
        placeholder: 'Departamento'
        , optionsState: departamentos.map(element => {
            return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
        })
    })
    const [provincia, selectProvincia, setProvincia, setInvalidProvincia, setOptionsProvincia, , , setDisabledProvincia] = useSelect({
        placeholder: 'Provincia'
    })
    const [distrito, selectDistrito, setDistrito, setInvalidDistrito, setOptionsDistrito, , , setDisabledDistrito] = useSelect({
        placeholder: 'Distrito'
    })
    const [direccion, inputDireccion, setDireccion, setInvalidDireccion] = useInput({
        placeholder: "Calle | Avenida | Jr."
    })
    const [nro, inputNro, setNro, setInvalidNro] = useInput({
        placeholder: 'N°', typeState: 'number'
    })
    const [nacionalidad, selectNacionalidad, setNacionalidad, setInvalidNacionalidad, setOptionsNacionalidad] = useSelect({
        placeholder: 'Nacionalidad',
    })
    const [observaciones, inputObservaciones, setObservaciones] = useInput({
        placeholder: 'Observaciones'
    })
    const [correo, inputCorreo, setCorreo, ] = useInput({
        typeState: 'text', placeholder:'Correo'
    })
    const [disabledSave, setDisabledSave] = useState(false)
    const [detalle, setDetalle] = useState([]);
    const [views, setViews] = useState([]);
    const [doc1, setdoc1]= useState(null)
    const [doc2, setdoc2]= useState(null)

    useEffect(() => {
        let options = []
        for (const codigo in paisesSudamerica) {
            options.push({label: paisesSudamerica[codigo], value: codigo})
        }
        setOptionsNacionalidad(options)
        setNacionalidad('PE')
    }, [])
    useEffect(() => {

        setNombres(cliente.nombres ?? '')
        setDNI(cliente.documento_identidad ?? '')
        setDepartamento(cliente.departamento ?? '')
        setDireccion(cliente.direccion ?? '')
        setNro(cliente.numero_direccion ?? '')
        setNacionalidad(cliente.nacionalidad ?? 'PE')
        setObservaciones(cliente.observacion ?? '')
        setCorreo(cliente.correo ?? '')
        setViews([])
        setDetalle([])
        if (cliente.celulares) {
            const viewsNew = [], detalleNew = []
            for (const element of cliente.celulares) {
                viewsNew.push({...element})
                detalleNew.push(element.id)
            }
            setViews(viewsNew)
            setDetalle(detalleNew)
        } else agregar()

    }, [cliente])
    useEffect(() => {
        if (cliente.id) {
            if (cliente.provincia) {
                const optionsP = provincias[cliente.departamento].map(element => {
                    return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
                })
                setOptionsProvincia(optionsP)
                setProvincia(cliente.provincia ?? '')
            }
            if (cliente.distrito) {
                const options = distritos[cliente.provincia].map(element => {
                    return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
                })
                setOptionsDistrito(options)
                setDistrito(cliente.distrito ?? '')

            }
        }
    }, [cliente, provincia, distrito])
    useEffect(() => {
        const invalidNombres = nombres === ''
        const invalidDni = dni === ''
        const invalidDepartamento = departamento === ''
        const invalidProvincia = provincia === ''
        const invalidDistrito = distrito === ''
        const invalidDireccion = direccion === ''
        const invalidNro = nro === ''
        const invalidNacionalidad = nacionalidad === ''
        const invalidTelefonos = views.some(element => element.invalid)
        setInvalidDni(invalidDni)
        setInvalidNombres(invalidNombres)
        setInvalidDepartamento(invalidDepartamento)
        setInvalidProvincia(invalidProvincia)
        setInvalidDistrito(invalidDistrito)
        setInvalidDireccion(invalidDireccion)
        setInvalidNro(invalidNro)
        setInvalidNacionalidad(invalidNacionalidad)
        setDisabledSave(invalidTelefonos || invalidNacionalidad || invalidDni
            || invalidNombres || invalidDepartamento || invalidProvincia || invalidDistrito || invalidDireccion || invalidNro)
    }, [nombres, dni, departamento, provincia, distrito, direccion, nro, nacionalidad, views])
    useEffect(() => {
        if (!departamento || departamento === '') {
            setOptionsProvincia([])
            setProvincia('')
            setDisabledProvincia(true)
            return
        }
        setProvincia('')
        setOptionsProvincia([])
        setDistrito('')
        setOptionsDistrito([])
        setDisabledProvincia(false)
        const options = provincias[departamento].map(element => {
            return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
        })
        setOptionsProvincia(options)
    }, [departamento])
    useEffect(() => {
        if (!provincia || provincia === '') {
            setOptionsDistrito([])
            setDistrito('')
            setDisabledDistrito(true)
            return
        }
        setDistrito('')
        setOptionsDistrito([])
        setDisabledDistrito(false)
        const options = distritos[provincia].map(element => {
            return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
        })
        setOptionsDistrito(options)
        if (cliente.distrito) setDistrito(cliente.distrito)
    }, [provincia, cliente])

    const agregar = () => {
        const id = cadenaAleatoria(8);
        setViews((prevState) => [
            ...prevState,
            {
                id, invalid: true
            },
        ]);
        setDetalle((prevState) => [...prevState, id]);

    }
    useEffect(() => {
        agregar()
    }, [])
    const guardar = async () => {
        Toast.Waiting('Guardando...')
        let object = {
            documento_identidad: dni, direccion, numero_direccion: nro,correo: correo??null,
            observacion: observaciones ?? null, nacionalidad,
            nombres, provincia, departamento, distrito, celulares: views.map(element => {
                return {id: element.id, tipo: element.tipo, numero: element.numero}
            }), doc2, doc1
        }
        if (cliente.id) object = {...object, id: cliente.id}
        try {
            const {data} = await Clientes.createOrUpdate(object, 'id, estado,correo,documento_identidad, direccion, observacion,numero_direccion,nombres, provincia, dni_back,dni_front,departamento, distrito, nacionalidad,celulares{id, tipo, numero}')
            const newcliente = data.createOrUpdateClientes
            if (cliente.id) {
                setData(prev => prev.map(element => element.id === cliente.id ? {...newcliente, cliente_routers: element.cliente_routers} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                setdoc2(null)
                setdoc1(null)
                return
            }
            setData(prev => [{...newcliente}, ...prev])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setdoc2(null)
            setdoc1(null)
            setConfig({...config, isOpen: false})

        } catch (e) {
            Toast.Remove()
            Toast.Error(e.message)
        }

    }

    const onDrop1 = accepted => {
        uploadImg(accepted[0], 'multimedia', null)
            .then(response => response.json())
            .then(({data}) => {
                setdoc1(data.name)
            })
            .catch(({message}) => {
                Toast.Error(message, {autoClose: 4000})
            })
    }
    const onDrop2 = accepted => {
        uploadImg(accepted[0], 'multimedia', null)
            .then(response => response.json())
            .then(({data}) => {
                setdoc2(data.name)
            })
            .catch(({message}) => {
                Toast.Error(message, {autoClose: 4000})
            })
    }
    const [documentos, setDocumentos]= useState([])
    const [configView, setConfigView]= useState(false)

    const handleIconClick=async (nombre, url)=>{
        setDocumentos([{nombre, url}])
        setConfigView(true)
    }

    return (
        <Dialog open={config.isOpen} fullWidth
                maxWidth="md">
            <DialogTitle>
                {cliente?.id ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 1}}>
                        {inputDni}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputNombres}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {selectDepartamento}
                    {selectProvincia}
                    {selectDistrito}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 3, border: '1px solid #ccc', borderRadius: '8px', padding: '10px'}}>
                        <Typography variant="h6" gutterBottom>
                            Subir Documento de identidad
                        </Typography>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                            <FormControl style={{flex: 2, border: '1px solid #ccc', borderRadius: '8px'}}>
                                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                                    <FormControl style={{flex: 8}}>
                                        <MyDropzone onDrop={onDrop1} placeholder="DNI Lado1"/>
                                    </FormControl>
                                    {cliente?.dni_front&&
                                        <IconButton
                                            title="Ver detalle"
                                            component="label"
                                            onClick={async () => await handleIconClick('DNI Frontal', cliente.dni_front)}
                                            style={{
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            <Icon
                                                icon="mdi:eye"
                                                style={{
                                                    fontSize: 18,
                                                    color: 'inherit'
                                                }}
                                            />
                                        </IconButton>
                                    }
                                </Stack>
                            </FormControl>
                            <FormControl style={{flex: 2, border: '1px solid #ccc', borderRadius: '8px'}}>
                                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                                    <FormControl style={{flex: 8}}>
                                        <MyDropzone onDrop={onDrop2} placeholder="DNI Lado2"/>
                                    </FormControl>
                                    {cliente?.dni_back &&
                                        <IconButton
                                            title="Ver detalle"
                                            component="label"
                                            onClick={async () => await handleIconClick('DNI Reverso', cliente.dni_back)}
                                            style={{
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            <Icon
                                                icon="mdi:eye"
                                                style={{
                                                    fontSize: 18,
                                                    color: 'inherit'
                                                }}
                                            />
                                        </IconButton>
                                    }
                                </Stack>
                            </FormControl>
                        </Stack>

                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 3, border: '1px solid #ccc', borderRadius: '8px', padding: '10px'}}>
                        <Typography variant="h6" gutterBottom>
                            Datos telefónicos
                        </Typography>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                style={{margin: 3}}
                                onClick={() => agregar()}
                            >
                                <Icon icon="mdi:plus-circle"/> Agregar
                            </Button>
                        </div>
                        <div style={{justifyContent: 'center'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            className="align-top"
                                            style={{margin: 0, padding: 0, textAlign: 'center'}}
                                        >
                                            TIPO
                                        </TableCell>
                                        <TableCell
                                            className="align-top"
                                            style={{margin: 0, padding: 0, textAlign: 'center'}}
                                        >
                                            NÚMERO
                                        </TableCell>
                                        <TableCell className="align-top"
                                                   style={{margin: 0, padding: 0, textAlign: 'center'}}>
                                            ACCIONES
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        detalle.map((element, index) => {
                                            const view = views.find(({id}) => id === element);
                                            return (
                                                <ItemsTelefono key={view.id} setDetalle={setDetalle} setViews={setViews}
                                                               telefono={view} views={views} detalle={detalle}
                                                               first={index === 0}/>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </FormControl>
                    <FormControl style={{flex: 3, border: '1px solid #ccc', borderRadius: '8px', padding: '10px'}}>
                        <Typography variant="h6" gutterBottom>
                            Datos adicionales
                        </Typography>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingTop: '5%', margin: 0}} spacing={1}>
                            <FormControl style={{flex: 8, padding: 0, margin: 0}}>
                                {inputDireccion}
                            </FormControl>
                            <FormControl style={{flex: 3, padding: 0, margin: 0}}>
                                {inputNro}
                            </FormControl>
                        </Stack>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingTop: '2%'}} spacing={2}>
                            {selectNacionalidad}
                        </Stack>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingTop: '2%'}} spacing={2}>
                            {inputCorreo}
                        </Stack>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingTop: '2%'}} spacing={2}>
                            {inputObservaciones}
                        </Stack>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave}
                    onClick={() => guardar()}
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
export default ModalClientes
