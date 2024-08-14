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
import Gps from "../../../../Models/Gps";

const ModalGPS= ({config, gps, setConfig, setData})=>{
    ModalGPS.propTypes={
        config: PropTypes.object,
        gps: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }
    const [disabledSave, setDisabledSave] = useState(false)
    const [producto, inputProducto, setProducto, setInvalidProducto, , invalidProducto] = useInput({
        placeholder: "Producto",
    })
    const [imei, inputImei, setImei, setInvalidImei, , invalidImei] = useInput({
        placeholder: "IMEI/ID",
    })
    const [marca, inputMarca, setMarca, setInvalidMarca, , invalidMarca] = useInput({
        placeholder: "Marca",
    })
    const [modelo, inputModelo, setModelo, setInvalidModelo, , invalidModelo] = useInput({
        placeholder: "Modelo",
    })
    const [sede, selectSede, setSede, setInvalidSedes, setOptionSedes, , invalidSede] = useSelect({
        placeholder: 'Sede'
    })
    const [chip, inputChip, setChip, setInvalidChip, , invalidChip] = useInput({
        placeholder: "SIMCARD",
    })
    const [fecha, inputFecha, setFecha, setInvalidFecha, , invalidFecha] = useInput({
        placeholder: "F.Compra", typeState: 'date', initialState: moment().format('YYYY-MM-DD')
    })

    const save= async()=>{
        Toast.Waiting('Guardando...')
        let object={
            producto, imei, marca, modelo, sede_id: sede, nro_sim: chip,
            fecha_compra: fecha
        }
        if(gps.id) object={...object, id: gps.id}
        try {
            const {data}= await Gps.createOrUpdateGps(object)
            const newGps= data.createOrUpdateGps
            if(gps.id){
                setData(prev => prev.map(element => element.id === gps.id ? {...newGps} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                return
            }
            setData(prev => [{...newGps}, ...prev])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
        }
        catch (e){
            Toast.Remove()
            Toast.Error(e.message)
        }
    }
    useEffect(()=>{
        setOptionSedes([])
       Usuario.allSedes().then(response=>{
           const {allSedes}= response.data
           const options= []
           for(const element of allSedes){
               options.push({value: element.id, label: element.nombre})
           }
           setOptionSedes(options)
       })
    },[])
    useEffect(()=>{
        //producto, imei, marca, modelo, sede_id, nro_sim, fecha_compra
        setProducto(gps.producto??'')
        setImei(gps.imei??'')
        setMarca(gps.marca??'')
        setModelo(gps.modelo??'')
        setSede(gps.sede_id??'')
        setChip(gps.nro_sim??'')
        setFecha(gps.fecha_compra?? moment().format('YYYY-MM-DD'))
    },[gps])
    useEffect(()=>{
        const invalidProducto= producto===''
        const invalidImei= imei===''
        const invalidMarca= marca===''
        const invalidModelo= modelo===''
        const invalidSede= sede===''
        const invalidChip= chip===''
        const invalidFecha= fecha===''

        setInvalidProducto(invalidProducto)
        setInvalidImei(invalidImei)
        setInvalidMarca(invalidMarca)
        setInvalidSedes(invalidSede)
        setInvalidModelo(invalidModelo)
        setInvalidChip(invalidChip)
        setInvalidFecha(invalidFecha)
        setDisabledSave(invalidFecha || invalidChip || invalidSede || invalidModelo || invalidMarca || invalidImei || invalidProducto)
    },[producto, imei, marca, modelo, sede, chip, fecha])



    return(
        <Dialog open={config.isOpen} fullWidth
                maxWidth="sm">
            <DialogTitle>
                {gps?.id ? 'Editar GPS' : 'Nuevo GPS'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputProducto}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputImei}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputChip}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputFecha}
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
export default ModalGPS