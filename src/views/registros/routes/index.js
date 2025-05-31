import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {Box, Button, Card, CardContent, Container, IconButton} from "@mui/material";
import {Icon} from "@iconify/react";
import Usuario from "../../../Models/Usuario";
import Routers from "../../../Models/Routers";
import ModalRoute from "./components/ModalRoute";
import Label from "../../../components/label";
import DocumentViewer from "../../../components/DocumentosViewer";
import useInput from "../../../customHooks/useInput";


const Rastreador = () => {
    const colorState = {
        ACTIVO: 'success',
        LIBRE: 'primary',
        USADO: 'warning',
        ELIMINADO: 'error',
    };
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [sedes, setSedes]= useState([])
    const [router, setRouter] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)
    const [time, setTime]= useState(0)

    const [buscar, inputBuscar] = useInput({
        typeState: 'text', initialState: '', placeholder: 'Buscar...'
    })
    useEffect(()=>{
        setTimeout(()=>{
            setTime(0)
        },time*1000)
    },[time])
    useEffect(() => {
        setTime(2)
    }, [buscar])

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
        if(time>0) return
        setLoading(true)
        Routers.listRouters(page, limit, buscar)
            .then(response=>{
                const {allRouters, info} = response.data.listRouters.data
                setData(allRouters)
                setInfoData(info)
                setLoading(false)
            })
    }, [page, limit, time])
    const [documentos, setDocumentos]= useState([])
    const [configView, setConfigView]= useState(false)
    const handleIconClick=(url, nombre)=>{
        setDocumentos([{nombre, url}])
        setConfigView(true)
    }

    return (
        <Container>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="flex-start" width="100%" marginTop={2}>
                        <Box>{inputBuscar}</Box>
                    </Box>
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
                            header: ' ',
                            Cell: (row) => {
                                const {id_file, imei} = row
                                return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {id_file && (
                                        <IconButton
                                            title="Ver detalle"
                                            component="label"
                                            onClick={() => handleIconClick(id_file, `Router-${imei}`)}
                                            style={{
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            <Icon
                                                icon="mdi:eye"
                                                style={{
                                                    fontSize: 18,
                                                    color: 'inherit'
                                                }}
                                            />
                                        </IconButton>
                                    )}
                                </div>
                            },
                            cellStyle: {minWidth: '3px'},
                            align: "center",
                        },
                        {
                            header: 'Código',
                            accessor: 'codigo',
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
                            header: 'Precio Plan',
                            accessor: 'precio_servicio',
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
                            Cell:(row)=>{
                              const {estado}= row
                              return (<Label variant="soft" color={colorState[estado.toUpperCase()]} sx={{textTransform: 'capitalize'}}>
                                  {estado}
                              </Label>)
                            },
                            align: "center",
                        },
                        {
                            header: 'Fecha Compra',
                            accessor: 'fecha_compra',
                            align: "center",
                        },
                    ]}/>
                </CardContent>
            </Card>
            <ModalRoute router={router} config={config} setConfig={setConfig} setData={setData}/>
            <DocumentViewer documentos={documentos} config={configView} setConfig={setConfigView}/>
        </Container>
    )
}
export default Rastreador