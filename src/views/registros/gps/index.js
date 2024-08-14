import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {Box, Button, Card, CardContent, Container} from "@mui/material";
import {Icon} from "@iconify/react";
import ModalGPS from "./components/ModalGPS";
import Usuario from "../../../Models/Usuario";
import {element} from "prop-types";
import Gps from "../../../Models/Gps";


const Rastreador = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [sedes, setSedes] = useState([])
    const [gps, setGps] = useState({})
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
        setGps(row)
        setConfig({...config, isOpen: true})
    }
    useEffect(() => {
        setLoading(true)
        Gps.listGps(page, limit)
            .then(response=>{
                const {allGps, info} = response.data.listGps.data
                setData(allGps)
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
                                setGps({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo GPS
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
                            header: 'Producto',
                            accessor: 'producto',
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
                            accessor: 'nro_sim',
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
                        }
                    ]}/>
                </CardContent>
            </Card>
            <ModalGPS gps={gps} config={config} setConfig={setConfig} setData={setData}/>
        </Container>
    )
}
export default Rastreador