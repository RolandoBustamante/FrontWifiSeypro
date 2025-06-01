import PropTypes from "prop-types";
import useSelect from "../../customHooks/useSelect";
import {useEffect} from "react";
import Usuario from "../../Models/Usuario";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Stack} from "@mui/material";
import useInput from "../../customHooks/useInput";
import {LoadingButton} from "@mui/lab";
import Toast from "../../utils/toastUtil";
import Routers from "../../Models/Routers";


const ModalAnular = ({config, sede_id, id, setConfig}) => {
    ModalAnular.propTypes = {
        config: PropTypes.object,
        sede_id: PropTypes.string,
        id: PropTypes.string,
        setConfig: PropTypes.func,
    }

    const [sede, selectSede, setSede, , setOptionSedes, ,] = useSelect({
        placeholder: 'Sede'
    })
    const [estado, selectEstado, ] = useSelect({
        placeholder: 'Motivo',
        optionsState: [{value: 'MALOGRADO', label: 'MALOGRADO'}, {value: 'DEVUELTO', label: 'DEVUELTO'}, {value: 'NO DEVUELTO', label: 'NO DEVUELTO'}],
        initialState: ''
    })
    const [observacion, inputObservacion, ] = useInput({
            initialState: '', placeholder: 'Observaciones'
        }
    )

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
        if (sede_id) {
            setSede(sede_id ?? '')
        }
    }, [sede_id])
    const save= ()=>{
        if (!estado || estado==='') {
            Toast.Error('Debe seleccionar el estado');
            return;
        }
        if (!sede || sede==='') {
            Toast.Error('Debe seleccionar la sede');
            return;
        }
        Routers.cancelarClienteRouter({id, sede, observacion, estado})
            .then(()=>{
                setConfig({...config, isOpen: false})
                window.location.reload();
            })
    }


    return (
        <Dialog open={config.isOpen} fullWidth>
            <DialogTitle>Cambio Router</DialogTitle>
            <br/>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 2}}>
                        {selectEstado}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {selectSede}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputObservacion}
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
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
export default ModalAnular