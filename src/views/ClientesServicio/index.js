import React, { useEffect, useState } from "react";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import { Box, Card, CardContent, Container } from "@mui/material";
import Clientes from "../../Models/Clientes";
import useInput from "../../customHooks/useInput";
import moment from "moment";
import ModalAnular from "../ModalAnular/ModalAnular";

const RastreadorRouters = () => {
    const [data, setData] = useState([]);
    const [infoData, setInfoData] = useState({});
    const [page, setPage] = useState(null);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [param, inputParam]= useInput({
        placeholder:'Buscar por cliente, IMEI, chip o DNI'
    })
    const [config, setConfig] = useState({isOpen: false})
    const [id, setId]= useState(null)
    const [sede, setSede]= useState(null)
    const [time, setTime]= useState(0)
    useEffect(()=>{
        setTime(2)
    },[param])
    useEffect(()=>{
        setTimeout(()=>{
            setTime(0)
        },time*1000)
    },[time])

    useEffect(() => {
        setLoading(true);
        Clientes.listaClientesRoutersAll(page, limit, param).then(response => {
            const { allRouters, info } = response.data.listaClientesRoutersAll.data;
            setData(allRouters);
            setInfoData(info);
            setLoading(false);
        });
    }, [page, limit, time]);
    const remove=(row)=>{
        setId(row.value)
        setSede(row.sede_id)
        setConfig({...config, isOpen: true})
    }

    return (
        <Container>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="flex-start" width="100%" marginTop={2}>
                        <Box>{inputParam}</Box>
                    </Box>

                    <ReactTablePagination
                        data={data}
                        setLimit={setLimit}
                        loading={loading}
                        info={infoData}
                        setPage={setPage}
                        pagination
                        columns={[
                            {
                                header: 'Acciones',
                                buttons: [
                                    {
                                        icon: 'mdi:trash-can',
                                        onClick: (row) => remove(row),
                                        color: "error",
                                    }
                                ],
                                align: "center",
                            },
                            {
                                header: 'Fecha Pago',
                                accessor: 'nombres',
                                Cell: (row)=>{
                                    const { diaPago } = row;
                                    const base = moment(); // hoy
                                    const finMes = base.clone().endOf('month').date();
                                    const dia = diaPago > finMes ? finMes : diaPago;
                                    return <div>{base.clone().date(dia).format('YYYY-MM-DD')}</div>;
                                },
                                align: 'center'
                            },
                            {
                                header: 'Fecha Registro',
                                accessor: 'codigo',
                                align: "center",
                                Cell: (row) => {
                                    const {creado_en} = row
                                    return (<div>{moment(creado_en??'').format('YYYY-MM-DD')}</div>)
                                },
                            },
                            {
                                header: 'Inicio Servicio',
                                accessor: 'codigo',
                                align: "center",
                                Cell: (row) => {
                                    const {fecha_inicio} = row
                                    return (<div>{moment(fecha_inicio??'').format('YYYY-MM-DD')}</div>)
                                },
                            },
                            {
                                header: 'Cliente',
                                accessor: 'nombres',
                                align: 'center'
                            },
                            {
                                header: 'DNI / RUC',
                                accessor: 'documento_identidad',
                                align: 'center'
                            },
                            {
                                header: 'IMEI',
                                accessor: 'imei',
                                align: 'center'
                            },
                            {
                                header: 'SIM-CARD',
                                accessor: 'sim_card',
                                align: 'center'
                            },
                        ]}
                    />
                </CardContent>
            </Card>
            <ModalAnular config={config} setConfig={setConfig} id={id} sede_id={sede}/>
        </Container>
    );
};

export default RastreadorRouters;
