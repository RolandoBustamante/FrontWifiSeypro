import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import useInput from "../../../../customHooks/useInput";
import useSelect from "../../../../customHooks/useSelect";
import Toast from "../../../../utils/toastUtil";
import moment from "moment/moment";
import {useEffect, useState} from "react";
import Sims from "../../../../Models/Sims";
import {Icon} from "@iconify/react";

const ModalSims=({config, sim, setConfig, setData, sedes})=>{
    ModalSims.propTypes = {
        config: PropTypes.object,
        sim: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func,
        sedes: PropTypes.array
    }
    const [disabledSave, setDisabledSave] = useState(false)
    const [simCard, inputSimCard, setSimCard, setInvalidSimCard, , ] = useInput({
        placeholder: "Sim-Card", typeState: 'number'
    })
    const [marca, inputMarca, setMarca, setInvalidMarca, , ] = useInput({
        placeholder: "Marca",
    })
    const [paquete, inputPaquete, setPaquete, setInvalidPaquete, , ] = useInput({
        placeholder: "Paquete de datos",
    })
    const [fecha_renovacion, inputFecha_renovacion, setFecha_renovacion, setInvalidFecha_renovacion, , ] = useInput({
        placeholder: "Fecha Renovación", typeState: 'date'
    })
    const [sede, selectSede, setSede, setInvalidSedes, setOptionSedes, , ] = useSelect({
        placeholder: 'Sede'
    })


    const [sedeUnique, setSedeUnique]= useState(null)
    useEffect(()=>{
        setOptionSedes([])
        const options=[]
        for(const element of sedes){
            options.push({value: element.id, label: element.nombre})
        }
        setOptionSedes(options)
        if(sedes&&sedes.length>0 && sedes.length===1)setSedeUnique(sedes[0].id)
    }, [sedes, setOptionSedes])
    useEffect(()=>{
        // sim_card, marca, paquete, fecha_renovacion, activo, sede_id
        setSimCard(sim.sim_card??'')
        setMarca(sim.marca??'')
        setPaquete(sim.paquete??'')
        setFecha_renovacion(sim.fecha_renovacion??moment().format('YYYY-MM-DD'))
        setSede(sim.sede_id??sedeUnique)
    },[sim])
    useEffect(()=>{
        const invalidSim= simCard===''
        const invalidMarca= marca===''
        const invalidPaquete= paquete===''
        const invalidFecha= fecha_renovacion===''
        const invalidSede= sede===''
        setInvalidSimCard(invalidSim)
        setInvalidMarca(invalidMarca)
        setInvalidPaquete(invalidPaquete)
        setInvalidFecha_renovacion(invalidFecha)
        setInvalidSedes(invalidSede)
        setDisabledSave(invalidSim || invalidMarca || invalidPaquete || invalidFecha || invalidSede)
    },[simCard, marca, paquete, fecha_renovacion, sede])
    const save= async()=>{
        Toast.Waiting('Guardando...')
        let object={
            sim_card: simCard, marca, paquete, fecha_renovacion, sede_id: sede
        }
        if(sim.id) object= {...object, id: sim.id}
        try {
            const {data}= await Sims.createOrSims(object)
            const newSim= data.createOrUpdateSim
            if(sim.id){
                setData(prev => prev.map(element => element.id === sim.id ? {...newSim} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                return
            }
            setData(prev => [{...newSim}, ...prev])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
        }
        catch (e) {
            Toast.Remove()
            Toast.Error(e.message)
        }
    }


    return(
        <Dialog open={config.isOpen} fullWidth
                maxWidth="sm">
            <DialogTitle>
                {sim?.id ? 'Editar Sim' : 'Nuevo Sim'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputSimCard}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputMarca}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputPaquete}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {inputFecha_renovacion}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {selectSede}
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
export default ModalSims
