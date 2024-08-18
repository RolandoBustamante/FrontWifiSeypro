import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {Box, Button, Card, CardContent, Container} from "@mui/material";
import {Icon} from "@iconify/react";
import Usuario from "../../../Models/Usuario";
import Routers from "../../../Models/Routers";
import ModalRoute from "./components/ModalGPS";
import moment from "moment";


const Rastreador = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [sedes, setSedes]= useState([])
    const [router, setRouter] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        Usuario.allSedes().then(response => {
            const {allSedes} = response.data
            setSedes(allSedes)
        })
    }, [])
    const editCliente = (row) => {
        setRouter(row)
        setConfig({...config, isOpen: true})
    }
    useEffect(() => {
        setLoading(true)
        Routers.listRouters(page, limit)
            .then(response=>{
                const {allRouters, info} = response.data.listRouters.data
                setData(allRouters)
                setInfoData(info)
                setLoading(false)
            })
    }, [page, limit])

    return (
        <Container>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            style={{margin: 3}}
                            onClick={() => {
                                setRouter({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo Router
                        </Button>
                    </Box>
                    <ReactTablePagination data={data} setLimit={setLimit} loading={loading} info={infoData}
                                          setPage={setPage} pagination columns={[
                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => editCliente(div), color: "warning"
                                },
                            ],
                            align: "center",
                        },
                        {
                            header: 'Serie',
                            accessor: 'serie',
                            align: "center",
                        },
                        {
                            header: 'IMEI/ID',
                            accessor: 'imei',
                            align: "center",
                        },
                        {
                            header: 'Marca',
                            accessor: 'marca',
                            align: "center",
                        },
                        {
                            header: 'Modelo',
                            accessor: 'modelo',
                            align: "center",
                        },
                        {
                            header: 'SIMCARD',
                            accessor: 'numero_chip',
                            align: "center",
                        },
                        {
                            header: 'Sede',
                            Cell: (row) => {
                                const {sede_id} = row
                                const elemento= sedes.find(element=>element.id===sede_id)
                                return (<div>{elemento.nombre}</div>)
                            },
                            align: "center",
                        },
                        {
                            header: 'Estado',
                            accessor: 'estado',
                            align: "center",
                        },
                        {
                            header: 'Fecha Compra',
                            accessor: 'fecha_compra',
                            align: "center",
                        },
                        {
                            header: 'Fecha renovación',
                            Cell: (row) => {
                                let {fecha_renovacion} = row
                                const diaActual=moment().format('DD')
                                fecha_renovacion= moment(fecha_renovacion, 'YYYY-MM-DD').format('DD')
                                if(Number(diaActual)<=Number(fecha_renovacion))
                                    fecha_renovacion= `${moment().format("YYYY-MM")}-${fecha_renovacion}`
                                else fecha_renovacion= `${moment().add(1, 'month').format("YYYY-MM")}-${fecha_renovacion}`
                                return (<div>{fecha_renovacion}</div>)
                            },
                            align: "center",
                        }
                    ]}/>
                </CardContent>
            </Card>
            <ModalRoute router={router} config={config} setConfig={setConfig} setData={setData}/>
        </Container>
    )
}
export default Rastreador