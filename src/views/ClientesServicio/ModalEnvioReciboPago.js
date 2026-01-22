import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Stack,
    Typography,
    Checkbox
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import moment from "moment";
import useInput from "../../customHooks/useInput";
import Toast from "../../utils/toastUtil";
import Clientes from "../../Models/Clientes";


const ModalEnvioReciboPago = ({config, setConfig, cliente}) => {
    ModalEnvioReciboPago.propTypes = {
        config: PropTypes.object,          // { isOpen: bool, ... }
        setConfig: PropTypes.func,
        cliente: PropTypes.object,         // para precargar correo / tel si quieres
    };

    // === 1) Periodo de cobro (type="month") ===
    const currentMonth = moment().format("YYYY-MM");
    const maxMonth = moment().add(2, "months").format("YYYY-MM");

    const [
        periodoCobro,
        inputPeriodoCobro,
        setPeriodoCobro,
        setInvalidPeriodoCobro,
    ] = useInput({
        placeholder: "Periodo de cobro",
        typeState: "month",
        // estos extra dependen de cómo implementaste useInput;
        // la idea es que se pasen a <TextField {...rest} />
        min: currentMonth,
        max: maxMonth,
        defaultValue: currentMonth
    });

    // === 2) Checkboxes canales de envío ===
    const [sendWhatsapp, setSendWhatsapp] = useState(true);
    const [sendCorreo, setSendCorreo] = useState(false);

    // === 3) Inputs condicionales ===
    const [
        numeroWhatsapp,
        inputNumeroWhatsapp,
        setNumeroWhatsapp,
        setInvalidNumeroWhatsapp
    ] = useInput({
        placeholder: "Número WhatsApp",
        typeState: "text"
    });

    const [
        correo,
        inputCorreo,
        setCorreo,
        setInvalidCorreo
    ] = useInput({
        placeholder: "Correo electrónico",
        typeState: "text"
    });

    const [disabledSave, setDisabledSave] = useState(false);

    useEffect(() => {
        setCorreo(cliente.correo ?? '');
        setNumeroWhatsapp(cliente.celular ?? '')

        setPeriodoCobro(currentMonth);
    }, [cliente]);

    // Validaciones básicas
    useEffect(() => {
        const invalidPeriodo = !periodoCobro;
        setInvalidPeriodoCobro(invalidPeriodo);

        let invalidWhatsapp = false;
        if (sendWhatsapp) {
            invalidWhatsapp = !numeroWhatsapp;
            setInvalidNumeroWhatsapp(invalidWhatsapp);
        } else {
            setInvalidNumeroWhatsapp(false);
        }

        let invalidMail = false;
        if (sendCorreo) {
            invalidMail = !correo;
            setInvalidCorreo(invalidMail);
        } else {
            setInvalidCorreo(false);
        }

        const noCanalSeleccionado = !sendWhatsapp && !sendCorreo;

        setDisabledSave(
            invalidPeriodo ||
            invalidWhatsapp ||
            invalidMail ||
            noCanalSeleccionado
        );
    }, [periodoCobro, numeroWhatsapp, correo, sendWhatsapp, sendCorreo]);

    const handleGuardar = async () => {
        try {
            Toast.Waiting("Preparando envío...");
            await Clientes.enviarReciboPorPeriodo({
                cliente_router_id: cliente.value,
                periodo: periodoCobro,
                enviarWhatsapp: sendWhatsapp,
                enviarCorreo: sendCorreo, numero: numeroWhatsapp, correo
            })
            Toast.Remove();
            Toast.Success("Envio realizado");
            setConfig({...config, isOpen: false});
        } catch (e) {
            Toast.Remove();
            Toast.Error(e.message ?? "Error al preparar el envío");
        }
    };

    const handleClose = () => {
        setConfig({...config, isOpen: false});
    };

    return (
        <Dialog open={config.isOpen} fullWidth maxWidth="sm">
            <DialogTitle>
                Envío de recibo de pago
            </DialogTitle>
            <DialogContent>
                {/* PERIODO DE COBRO */}
                <Stack direction={{xs: "column", sm: "row"}}
                       spacing={2}
                       sx={{pt: 1, pb: 2}}>
                    <FormControl sx={{flex: 1}}>
                        <Typography variant="subtitle2" gutterBottom>
                            Periodo de cobro
                        </Typography>
                        {inputPeriodoCobro}
                    </FormControl>
                </Stack>

                {/* CANALES DE ENVÍO */}
                <Stack direction="column" spacing={1} sx={{pb: 2}}>
                    <Typography variant="subtitle2">
                        Canales de envío
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={sendWhatsapp}
                                onChange={e => setSendWhatsapp(e.target.checked)}
                            />
                        }
                        label="Enviar por WhatsApp"
                    />
                    {sendWhatsapp && (
                        <Stack direction={{xs: "column", sm: "row"}} spacing={2} sx={{pl: 3, pt: 1}}>
                            <FormControl sx={{flex: 1}}>
                                {inputNumeroWhatsapp}
                            </FormControl>
                        </Stack>
                    )}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={sendCorreo}
                                onChange={e => setSendCorreo(e.target.checked)}
                            />
                        }
                        label="Enviar por correo electrónico"
                    />
                    {sendCorreo && (
                        <Stack direction={{xs: "column", sm: "row"}} spacing={2} sx={{pl: 3, pt: 1}}>
                            <FormControl sx={{flex: 1}}>
                                {inputCorreo}
                            </FormControl>
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave}
                    onClick={handleGuardar}
                >
                    Enviar
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

export default ModalEnvioReciboPago;
