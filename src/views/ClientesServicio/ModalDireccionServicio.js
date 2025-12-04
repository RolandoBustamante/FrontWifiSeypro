import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import moment from "moment";
import useInput from "../../customHooks/useInput";
import Routers from "../../Models/Routers";
import Toast from "../../utils/toastUtil";

const ModalDireccionServicio = ({config, setConfig, cliente, setData}) => {
    ModalDireccionServicio.propTypes = {
        config: PropTypes.object,
        setConfig: PropTypes.func,
        cliente: PropTypes.object, setData: PropTypes.func
    };

    const [
        direccionServicio,
        inputDireccionServicio,
        setDireccionServicio,
        setInvalidDireccionServicio
    ] = useInput({
        placeholder: "Dirección del servicio",
        typeState: "text"
    });

    const [
        inicioServicio,
        inputInicioServicio,
        setInicioServicio,
        setInvalidInicioServicio
    ] = useInput({
        placeholder: "Inicio de servicio",
        typeState: "date"
    });

    const [
        diaCobro,
        inputDiaCobro,
        setDiaCobro,
        setInvalidDiaCobro
    ] = useInput({
        placeholder: "Día de cobro (día del mes)",
        typeState: "number",
        min: 1,
        max: 31
    });
    useEffect(() => {
        setDireccionServicio(cliente.direccion_servicio ?? '')
        setInicioServicio(cliente.fecha_inicio ?? '')
        setDiaCobro(cliente.diaPago ?? '')
    }, [cliente])

    const [disabledSave, setDisabledSave] = useState(false);
    const [saving, setSaving] = useState(false);

    // Si quieres precargar datos cuando abras el modal (ej. al editar)
    useEffect(() => {
        if (!config?.data) return;

        const {direccionServicio: dirIni, inicioServicio: inicioIni, diaCobro: diaIni} = config.data;

        if (dirIni) setDireccionServicio(dirIni);

        if (inicioIni) {
            const m = moment(inicioIni);
            if (m.isValid()) {
                setInicioServicio(m.format("YYYY-MM-DD"));
            }
        }

        if (diaIni) {
            setDiaCobro(String(diaIni));
        }
    }, [config?.data]);

    // Cuando cambia el inicio de servicio, actualizar día de cobro
    useEffect(() => {
        if (!inicioServicio) return;

        const m = moment(inicioServicio, "YYYY-MM-DD", true);
        if (!m.isValid()) return;

        const day = m.date(); // 1–31
        setDiaCobro(String(day));
    }, [inicioServicio]);

    // Validaciones
    useEffect(() => {
        const invalidDir = !direccionServicio || direccionServicio.trim().length === 0;
        setInvalidDireccionServicio(invalidDir);

        const mInicio = inicioServicio
            ? moment(inicioServicio, "YYYY-MM-DD", true)
            : null;
        const invalidInicio = !mInicio || !mInicio.isValid();
        setInvalidInicioServicio(invalidInicio);

        const dayNum = Number(diaCobro);
        const invalidDia =
            !diaCobro ||
            isNaN(dayNum) ||
            dayNum < 1 ||
            dayNum > 31;
        setInvalidDiaCobro(invalidDia);

        setDisabledSave(invalidDir || invalidInicio || invalidDia);
    }, [direccionServicio, inicioServicio, diaCobro]);

    const handleClose = () => {
        setConfig({...config, isOpen: false});
    };

    const handleGuardar = async () => {
        if (disabledSave) return;
        try {
            setSaving(true);
            Toast.Waiting('Guardando...')
            Routers.editarDireccionClienteRouter({
                id: cliente.value,
                direccion_servicio: direccionServicio,
                fecha_inicio: inicioServicio,
                diaPago: diaCobro
            })
                .then(() => {
                    setData(prev =>
                        prev.map(element =>
                            element.value === cliente.value
                                ? {...element, direccion_servicio: direccionServicio, fecha_inicio: inicioServicio,
                                    diaPago: diaCobro }
                                : element
                        )
                    );
                    setConfig({...config, isOpen: false})

                })
            Toast.Remove()
            Toast.Success("Datos guardados correctamente");
            setConfig({...config, isOpen: false});
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={config.isOpen} fullWidth maxWidth="sm">
            <DialogTitle>Editar datos del servicio</DialogTitle>

            <DialogContent>
                <Stack
                    direction={{xs: "column", sm: "row"}}
                    spacing={2}
                    sx={{pt: 1, pb: 2}}
                >
                    <FormControl sx={{flex: 1}}>
                        {inputDireccionServicio}
                    </FormControl>
                </Stack>

                <Stack
                    direction={{xs: "column", sm: "row"}}
                    spacing={2}
                    sx={{pt: 1, pb: 2}}
                >
                    <FormControl sx={{flex: 1}}>
                        {inputInicioServicio}
                    </FormControl>

                    <FormControl sx={{flex: 1}}>
                        {inputDiaCobro}
                    </FormControl>
                </Stack>
            </DialogContent>

            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave || saving}
                    loading={saving}
                    onClick={handleGuardar}
                >
                    Guardar
                </LoadingButton>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalDireccionServicio;
