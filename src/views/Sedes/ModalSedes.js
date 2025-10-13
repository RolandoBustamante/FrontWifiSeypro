import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useInput from "../../customHooks/useInput";
import useSwitch from "../../customHooks/useSwitch";
import Usuario from "../../Models/Usuario";
import Toast from "../../utils/toastUtil";


const ModalSede = ({ config, sede, setConfig, setData }) => {
    ModalSede.propTypes = {
        config: PropTypes.object,
        sede: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func,
    };

    // Inputs
    const [nombre, inputNombre, setNombre, setInvalidNombre, , ] = useInput({
        placeholder: "Nombre de la sede",
    });
    const [codigo, inputCodigo, setCodigo, setInvalidCodigo, , ] = useInput({
        placeholder: "Código de la sede",
    });

    // Switch de almacén
    const [almacen, inputAlmacen, setAlmacen] = useSwitch({
        initialState: false,
    });

    const [disabledSave, setDisabledSave] = useState(false);

    // Cargar datos en modo edición
    useEffect(() => {
        setNombre(sede?.nombre ?? "");
        setCodigo(sede?.codigo ?? "");
        setAlmacen(!!sede?.almacen);
    }, [sede, setNombre, setCodigo, setAlmacen]);

    // Validaciones
    useEffect(() => {
        const invNombre = nombre.trim() === "";
        const invCodigo = codigo.trim() === "";

        setInvalidNombre(invNombre);
        setInvalidCodigo(invCodigo);

        setDisabledSave(invNombre || invCodigo);
    }, [nombre, codigo, setInvalidNombre, setInvalidCodigo]);

    // Guardar
    const guardar = async () => {
        try {
            Toast.Waiting("Guardando...");

            const payload = {
                id: sede?.id,
                nombre,
                codigo,
                almacen: !!almacen,
            };

            const { data } = await Usuario.createOrUpdateSede(payload, "id,nombre,codigo,almacen");
            const newSede = data.createOrUpdateSede;

            if (sede?.id) {
                setData((prev) =>
                    prev.map((el) => (el.id === sede.id ? { ...newSede } : el))
                );
            } else {
                setData((prev) => [newSede, ...prev]);
            }

            Toast.Remove();
            Toast.Success("Guardado exitoso");
            setConfig({ ...config, isOpen: false });
        } catch (e) {
            Toast.Remove();
            Toast.Error(e.message);
        }
    };

    return (
        <Dialog open={config.isOpen} fullWidth maxWidth="sm">
            <DialogTitle>{sede?.id ? "Editar Sede" : "Nueva Sede"}</DialogTitle>

            <DialogContent>
                {/* Nombre y código */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ py: 1 }}>
                    <FormControl sx={{ flex: 2 }}>{inputNombre}</FormControl>
                    <FormControl sx={{ flex: 1 }}>{inputCodigo}</FormControl>
                </Stack>

                {/* Switch de almacén */}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ py: 2, pl: 1 }}
                >
                    <b>¿Es almacén?</b> {inputAlmacen}
                </Stack>
            </DialogContent>

            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave}
                    onClick={guardar}
                >
                    Guardar
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

export default ModalSede;
