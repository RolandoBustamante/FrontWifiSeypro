import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {Box, Button, Card, CardContent, Container, FormControl, IconButton, Stack} from "@mui/material";
import {Icon} from "@iconify/react";
import Usuario from "../../../Models/Usuario";
import Routers from "../../../Models/Routers";
import ModalRoute from "./components/ModalRoute";
import Label from "../../../components/label";
import DocumentViewer from "../../../components/DocumentosViewer";
import useInput from "../../../customHooks/useInput";
import {useAuthContext} from "../../../auth/useAuthContext";
import useSelect from "../../../customHooks/useSelect";


const Rastreador = () => {
    const colorState = {
        ACTIVO: 'success',
        LIBRE: 'primary',
        USADO: 'warning',
        ELIMINADO: 'error',
        DEVUELTO: '#8f2ebd'
    };
    const {sesion} = useAuthContext()

    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [sedes, setSedes] = useState([])
    const [router, setRouter] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)
    const [time, setTime] = useState(0)
    const [sede, selectSede, setSede, , setOptionSedes, ,] = useSelect({
        placeholder: 'Sede'
    })
    const [estado, selectEstado] = useSelect({
        placeholder: 'Estado',
        optionsState: [
            {value: 'ACTIVO', label: 'ACTIVO'},
            {value: 'LIBRE', label: 'LIBRE'},
            {value: 'ELIMINADO', label: 'ELIMINADO'},
            {value: 'DEVUELTO', label: 'DEVUELTO'},
            {value: 'MALOGRADO', label: 'MALOGRADO'},
            {value: 'USADO', label: 'USADO'}
        ],
        initialState: ''
    })

    const [buscar, inputBuscar] = useInput({
        typeState: 'text', initialState: '', placeholder: 'Buscar...'
    })
    useEffect(() => {
        setTimeout(() => {
            setTime(0)
        }, time * 1000)
    }, [time])
    useEffect(() => {
        setTime(2)
    }, [buscar])

    useEffect(() => {
        Usuario.allSedes().then(response => {
            const {allSedes} = response.data
            setSedes(allSedes)
        })
    }, [])
    useEffect(() => {
        const sedesFiltradas = sesion?.rol?.id !== 'd10503e9-847b-48d6-a9ff-a0f182974300' ? sedes.filter(element => element.id !== sesion?.sede_seleccionada) : sedes
        const options = []
        for (const sede of sedesFiltradas) {
            options.push({value: sede.id, label: sede.nombre})
        }
        setOptionSedes(options)
        setSede(sesion?.rol?.id !== 'd10503e9-847b-48d6-a9ff-a0f182974300' ? sesion?.sede_seleccionada : '')
    }, [sedes, sesion])
    const editCliente = (row) => {
        setRouter(row)
        setConfig({...config, isOpen: true})
    }
    useEffect(() => {
        if (time > 0) return
        setLoading(true)
        Routers.listRouters(page, limit, buscar, sede, estado)
            .then(response => {
                const {allRouters, info} = response.data.listRouters.data
                setData(allRouters)
                setInfoData(info)
                setLoading(false)
            })
    }, [page, limit, time, sede, estado])
    const [documentos, setDocumentos] = useState([])
    const [configView, setConfigView] = useState(false)
    const handleIconClick = (url, nombre) => {
        setDocumentos([{nombre, url}])
        setConfigView(true)
    }

    return (
        <Container>
            <Card>
                <CardContent>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 2}}>
                            {inputBuscar}
                        </FormControl>
                        <FormControl style={{flex: 2}}>
                            {selectSede}
                        </FormControl>
                        <FormControl style={{flex: 2}}>
                            {selectEstado}
                        </FormControl>
                    </Stack>

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
                                return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                                const elemento = sedes.find(element => element.id === sede_id)
                                return (<div>{elemento.nombre}</div>)
                            },
                            align: "center",
                        },
                        {
                            header: 'Estado',
                            Cell: (row) => {
                                const {estado} = row
                                return (<Label variant="soft" color={colorState[estado.toUpperCase()]}
                                               sx={{textTransform: 'capitalize'}}>
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