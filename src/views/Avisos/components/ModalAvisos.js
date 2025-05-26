import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useInput from "../../../customHooks/useInput";
import PropTypes from "prop-types";
import Toast from "../../../utils/toastUtil";
import { useEffect } from "react";
import Usuario from "../../../Models/Usuario";

const ModalNumeroAviso = ({ config, numero, setConfig, setData }) => {
    ModalNumeroAviso.propTypes = {
        config: PropTypes.object,
        numero: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func,
    };

    const [numeroInput, inputNumero, setNumero] = useInput({
        placeholder: "Número",
    });

    const [nombreInput, inputNombre, setNombre] = useInput({
        placeholder: "Nombre",
    });

    useEffect(() => {
        setNumero(numero.numero ?? "");
        setNombre(numero.nombre ?? "");
    }, [numero, setNumero, setNombre]);

    const guardar = async () => {
        if (!numeroInput || !nombreInput) {
            Toast.Warning("Completa todos los campos");
            return;
        }

        Toast.Waiting("Guardando...");
        const dataEnviar = {
            numero: numeroInput,
            nombre: nombreInput,
        };
        if (numero.id) dataEnviar.id = numero.id;

        try {
            const { data } = await Usuario.createOrUpdateNumeroAviso(dataEnviar);
            const {numeroAviso, success} = data.createUpdateNumeroAviso.data;
            if(success){
                setData((prev) =>
                    numero.id
                        ? prev.map((item) => (item.id === numeroAviso.id ? numeroAviso : item))
                        : [numeroAviso, ...prev]
                );
                Toast.Remove();
                Toast.Success("Guardado exitoso");
                setConfig({ ...config, isOpen: false });
            }

        } catch (error) {
            Toast.Remove();
            Toast.Error(error.message);
        }
    };

    return (
        <Dialog open={config.isOpen} fullWidth maxWidth="sm">
            <DialogTitle>
                {numero?.id ? "Editar Número" : "Nuevo Número"}
            </DialogTitle>
            <DialogContent>
                <br />
                <Stack spacing={2} direction="column">
                    {inputNumero}
                    {inputNombre}
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton variant="contained" color="success" onClick={guardar}>
                    Aceptar
                </LoadingButton>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setConfig({ ...config, isOpen: false })}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalNumeroAviso;
