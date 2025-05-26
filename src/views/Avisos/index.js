
import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Container } from "@mui/material";
import { Icon } from "@iconify/react";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import ModalAviso from "./components/ModalAvisos";
import Usuario from "../../Models/Usuario";
import Swal from "sweetalert2";
import Toast from "../../utils/toastUtil";

const Avisos=()=>{
    const [data, setData] = useState([]);
    const [config, setConfig] = useState({ isOpen: false });
    const [numero, setNumero] = useState({});

    useEffect(() => {
        Usuario.listarNumerosAviso().then(response => {
            setData(response.data.listarNumerosAviso);
        });
    }, []);

    const editar = (row) => {
        setNumero(row);
        setConfig({ isOpen: true });
    };
    const remove=(row)=> {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el número ${row.numero}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Toast.Waiting("Guardando...");
                Usuario.desactivarNumeroAviso(row.id).then(response => {
                    console.log(response)
                    const { success } = response.data.desactivarNumeroAviso;
                    if (success) {
                        setData(prev => prev.filter(element => element.id !== row.id));
                        Toast.Remove();
                        Toast.Success("Número eliminado exitosamente");
                    }
                }).catch(error => {
                    Toast.Remove();
                    Toast.Error("Hubo un error al eliminar el número");
                    console.error(error);
                });
            }
        });
    }

    return (
        <Container>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setNumero({});
                                setConfig({ isOpen: true });
                            }}
                        >
                            <Icon icon="mdi:plus-circle" /> Nuevo Número
                        </Button>
                    </Box>
                    <ReactTablePagination
                        data={data}
                        columns={[
                            {
                                header: 'Número Whatsapp',
                                accessor: 'numero',
                                align: "center",
                            },
                            {
                                header: 'Nombre',
                                accessor: 'nombre',
                                align: "center",
                            },
                            {
                                header: 'Acciones',
                                buttons: [
                                    {
                                        icon: 'mdi:account-edit',
                                        onClick: (row) => editar(row),
                                        color: "warning",
                                    },
                                    {
                                        icon: 'mdi:trash-can',
                                        onClick: (row) => remove(row),
                                        color: "error",
                                    }
                                ],
                                align: "center",
                            },
                        ]}
                    />
                </CardContent>
            </Card>
            <ModalAviso
                config={config}
                numero={numero}
                setConfig={setConfig}
                setData={setData}
            />
        </Container>
    );
}
export default Avisos