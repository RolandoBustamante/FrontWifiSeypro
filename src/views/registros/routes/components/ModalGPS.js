import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Stack} from "@mui/material";
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

const ModalRoute = ({config, router, setConfig, setData}) => {
    const {sesion} = useAuthContext()
    ModalRoute.propTypes = {
        config: PropTypes.object,
        router: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }
    const [disabledSave, setDisabledSave] = useState(false)
    const [producto, inputProducto, setProducto, setInvalidProducto, , ] = useInput({
        placeholder: "Serie",
    })
    const [imei, inputImei, setImei, setInvalidImei, , ] = useInput({
        placeholder: "IMEI/ID",
    })
    const [marca, inputMarca, setMarca, setInvalidMarca, , ] = useInput({
        placeholder: "Marca",
    })
    const [modelo, inputModelo, setModelo, setInvalidModelo, , ] = useInput({
        placeholder: "Modelo",
    })
    const [sede, selectSede, setSede, setInvalidSedes, setOptionSedes, , ] = useSelect({
        placeholder: 'Sede'
    })
    const [chip, inputChip, setChip, setInvalidChip, , ] = useInput({
        placeholder: "SIMCARD",
    })
    const [fecha, inputFecha, setFecha, setInvalidFecha, , ] = useInput({
        placeholder: "Fecha de Inicio", typeState: 'date', initialState: moment().format('YYYY-MM-DD')
    })
    const [fechaCiclo, inputFechaCiclo, setFechaCiclo, setInvalidFechaCiclo, , ] = useInput({
        placeholder: "Fecha Ciclo", typeState: 'date', initialState: moment().format('YYYY-MM-DD')
    })

    const save = async () => {
        Toast.Waiting('Guardando...')
        let object = {
            imei, marca, modelo, serie: producto, numero_chip: chip, sede_id: sede,
            fecha_compra: fecha, fecha_renovacion: fechaCiclo
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
        setProducto(router.serie ?? '')
        setImei(router.imei ?? '')
        setMarca(router.marca ?? '')
        setModelo(router.modelo ?? '')
        setSede(router.sede_id ?? sesion.sede_seleccionada ?? '')
        setChip(router.numero_chip ?? '')
        setFecha(router.fecha_compra ?? moment().format('YYYY-MM-DD'))
        setFechaCiclo(router.fecha_renovacion ?? moment().format('YYYY-MM-DD'))
    }, [router])
    useEffect(() => {
        const invalidProducto = producto === ''
        const invalidImei = imei === ''
        const invalidMarca = marca === ''
        const invalidModelo = modelo === ''
        const invalidSede = sede === ''
        const invalidChip = chip === ''
        const invalidFecha = fecha === ''

        setInvalidProducto(invalidProducto)
        setInvalidImei(invalidImei)
        setInvalidMarca(invalidMarca)
        setInvalidSedes(invalidSede)
        setInvalidModelo(invalidModelo)
        setInvalidChip(invalidChip)
        setInvalidFecha(invalidFecha)
        setDisabledSave(invalidFecha || invalidChip || invalidSede || invalidModelo || invalidMarca || invalidImei || invalidProducto)
    }, [producto, imei, marca, modelo, sede, chip, fecha])


    return (
        <Dialog open={config.isOpen} fullWidth
                maxWidth="sm">
            <DialogTitle>
                {router?.id ? 'Editar Router' : 'Nuevo Router'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputProducto}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputImei}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputChip}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputFecha}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputFechaCiclo}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputMarca}
                    {inputModelo}
                    {selectSede}
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave}
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
        </Dialog>
    )
}
export default ModalRoute