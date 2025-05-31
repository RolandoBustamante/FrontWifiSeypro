import React, { useEffect, useState } from "react";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import { Box, Card, CardContent, Container } from "@mui/material";
import Clientes from "../../Models/Clientes";
import useInput from "../../customHooks/useInput";
import moment from "moment";

const RastreadorRouters = () => {
    const [data, setData] = useState([]);
    const [infoData, setInfoData] = useState({});
    const [page, setPage] = useState(null);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [param, inputParam]= useInput({
        placeholder:'Buscar por cliente, IMEI, chip o DNI'
    })
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
                                header: 'Fecha Pago',
                                accessor: 'nombres',
                                Cell: (row)=>{
                                    const {diaPago} = row
                                    return <div>{moment(`${moment().format('YYYY-MM')}-${diaPago}`).format('YYYY-MM-DD')}</div>
                                },
                                align: 'center'
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
                                header: 'SIM',
                                accessor: 'sim_card',
                                align: 'center'
                            },
                        ]}
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

export default RastreadorRouters;
