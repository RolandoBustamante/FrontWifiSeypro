import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Container } from "@mui/material";
import { Icon } from "@iconify/react";
import Label from "../../components/label";

import ReactTablePagination from "../../utilsComponents/CustomTable";
import Usuario from "../../Models/Usuario";
import ModalSede from "./ModalSedes";


const SedesPage = () => {
    const [data, setData] = useState([]);
    const [config, setConfig] = useState({ isOpen: false });
    const [infoData, setInfoData] = useState({});
    const [loading, setLoading] = useState(false);
    const [sede, setSede] = useState({});

    const colorBool = (v) => (v ? "success" : "error");

    const openEdit = (row) => {
        setSede(row);
        setConfig((prev) => ({ ...prev, isOpen: true }));
    };

    useEffect(() => {
        setLoading(true);
        Usuario.allSedes()
            .then((res) => {
                const list = res?.data?.allSedes ?? [];
                setData(list);
                setInfoData({
                    total: list.length,
                });
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ margin: 3 }}
                            onClick={() => {
                                setSede({});
                                setConfig((prev) => ({ ...prev, isOpen: true }));
                            }}
                        >
                            <Icon icon="mdi:plus-circle" /> Nueva Sede
                        </Button>
                    </Box>

                    <ReactTablePagination
                        data={data}
                        loading={loading}
                        info={infoData}
                        columns={[
                            {
                                header: "#",
                                align: "center",
                                Cell: (row) =>
                                    data.indexOf(row) + 1 ,
                            },
                            {
                                header: "Acciones",
                                align: "center",
                                buttons: [
                                    {
                                        icon: "mdi:account-edit",
                                        onClick: (row) => openEdit(row),
                                        color: "warning",
                                    },
                                ],
                            },
                            {
                                header: "Nombre",
                                accessor: "nombre",
                                align: "center",
                            },
                            {
                                header: "Código",
                                accessor: "codigo",
                                align: "center",
                            },
                            {
                                header: "¿Almacén?",
                                align: "center",
                                Cell: (row) => (
                                    <Label
                                        variant="soft"
                                        color={colorBool(!!row.almacen)}
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {row.almacen ? "Sí" : "No"}
                                    </Label>
                                ),
                            },
                        ]}
                    />
                </CardContent>
            </Card>

            <ModalSede
                config={config}
                setConfig={setConfig}
                setData={setData}
                sede={sede}
            />
        </Container>
    );
};

export default SedesPage;
