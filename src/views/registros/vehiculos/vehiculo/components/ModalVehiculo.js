import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import useInput from "../../../../../customHooks/useInput";
import useSelect from "../../../../../customHooks/useSelect";
import useSelectSearch from "../../../../../customHooks/useSelectSearch";
import Toast from "../../../../../utils/toastUtil";
import Gps from "../../../../../Models/Gps";
import Vehiculos from "../../../../../Models/Vehiculos";
import useAsyncSelect from "../../../../../customHooks/useAsyncSelect";
import Usuario from "../../../../../Models/Usuario";

const ModalVehiculo = ({config, vehiculo, setConfig, setData}) => {
    ModalVehiculo.propTypes = {
        config: PropTypes.object,
        vehiculo: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }

    const [disabledSave, setDisabledSave] = useState(false)
    const [placa, inputPlaca, setPlaca, setInvalidPlaca] = useInput({
        typeState: 'text', placeholder: 'Placa Nro'
    })
    const [tipoVehiculo, selectTipo, setTipo, setInvalidTipo, setOptionsTipo] = useSelect({
        initialState: '', placeholder: 'Tipo vehículo'
    })
    const [marca, selectMarca, setMarca, setInvalidMarca, setOptionsMarca] = useSelect({
        initialState: '', placeholder: 'Marca'
    })
    const [modelo, selectModelo, setModelo, setInvalidModelo, setOptionsModelo] = useSelect({
        initialState: '', placeholder: 'Modelo'
    })
    const [color, inputColor, setColor] = useInput({
        typeState: 'text', placeholder: 'Color'
    })
    const [sede, selectSede, setSede, setInvalidSedes, setOptionSedes, , invalidSede] = useSelect({
        placeholder: 'Sede'
    })
    const [comentario, inputComentario, setComentario] = useInput({
        typeState: 'text', placeholder: 'Comentario'
    })
    const [gps, selectGps, setGps, , setOptionsGps, , , optionsGps] = useAsyncSelect({
        labelPlace: 'Rastreador', modelo: {Model: Gps, respuesta: 'gpsParam'}
    })
    const [otrosGps, setOtrosGps]= useState([])
    useEffect(() => {
        Gps.gpsNoUtilizado().then(response => {
            const {gpsSinUtilizar} = response.data
            setOtrosGps(gpsSinUtilizar)
            setOptionsGps(gpsSinUtilizar)
        })
        Vehiculos.marcaModeloTipo()
            .then(response => {
                const {data} = response.data.marcaModeloTipo
                const {tipos, marcas, modelos} = data
                setOptionsModelo(modelos)
                setOptionsTipo(tipos)
                setOptionsMarca(marcas)
            })
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
        const invalidPlaca = placa === ''
        const invalidTipo = tipoVehiculo === ''
        const invalidMarca = marca === ''
        const invalidModelo = modelo === ''
        const invalidSede = sede === ''
        setInvalidPlaca(invalidPlaca)
        setInvalidTipo(invalidTipo)
        setInvalidMarca(invalidMarca)
        setInvalidSedes(invalidSede)
        setInvalidModelo(invalidModelo)
        setDisabledSave(invalidModelo || invalidMarca || invalidTipo || invalidSede || invalidPlaca)
    }, [placa, tipoVehiculo, marca, modelo, sede, gps])
    const save = async () => {
        Toast.Waiting('Guardando...')
        let object = {
            gps_id: Array.isArray(gps) || gps==='' ? null : gps, tipo_id: tipoVehiculo,
            modelo_id: modelo, marca_id: marca, placa, color, sede_id: sede
        }
        if (vehiculo.id) object = {...object, id: vehiculo.id}
        const {data} = await Vehiculos.createOrUpdate(object)
        const newVehiculo = data.createOrUpdateVehiculo
        if (vehiculo.id) {
            setData(prevState => prevState.map(element => element.id === vehiculo.id ? {...newVehiculo} : {...element}))
            Toast.Remove()
            Toast.Success('Guardado exitoso')
        } else {
            setData(prevState => [{...newVehiculo}, ...prevState])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
        }
        setConfig({...config, isOpen: false})
    }
    useEffect(() => {
        // gps_id , tipo_id ,  modelo_id,  marca_id, placa, color,sede_id
        setOptionsGps(otrosGps)
        setGps(null)
        if (vehiculo.gps && vehiculo.gps_id) {
            setOptionsGps([{value: vehiculo.gps.id, label: `${vehiculo.gps.marca}-${vehiculo.gps.imei}`}])
            setGps(vehiculo.gps_id)
        }
        setGps(vehiculo.gps_id??'')
        setTipo(vehiculo.tipo_id ?? '')
        setModelo(vehiculo.modelo_id ?? '')
        setMarca(vehiculo.marca_id ?? '')
        setPlaca(vehiculo.placa ?? '')
        setColor(vehiculo.color ?? '')
        setSede(vehiculo.sede_id ?? '')
    }, [vehiculo])
    // useEffect(() => {
    //     if (vehiculo.gps_id && optionsGps.length>0 && llenar) setTimeout(()=>{
    //         setGps(vehiculo.gps_id)
    //     }, 500)
    // }, [vehiculo, optionsGps, llenar])

    return (
        <Dialog open={config.isOpen} fullWidth
        >
            <DialogTitle>
                {vehiculo?.id ? 'Editar vehículo' : 'Nuevo vehículo'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputPlaca}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {selectTipo}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {selectMarca}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {selectModelo}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputColor}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {selectSede}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 3}}>
                        {selectGps}
                    </FormControl>
                    <FormControl style={{flex: 4}}>
                        {inputComentario}
                    </FormControl>
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
export default ModalVehiculo