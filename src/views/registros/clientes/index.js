import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton,
    Stack
} from "@mui/material";
import {Icon} from "@iconify/react";
import ModalClientes from "./components/ModalClientes";
import Clientes from "../../../Models/Clientes";
import {departamentos, distritos, provincias} from "../../../utils/constantes";
import useAsyncSelect from "../../../customHooks/useAsyncSelect";
import useInput from "../../../customHooks/useInput";
import moment from "moment";
import {LoadingButton} from "@mui/lab";
import Routers from "../../../Models/Routers";
import Label from "../../../components/label";
import Vendedores from "../../../Models/Vendedores";
import {esUUID} from "../../../utils/utils";
import Ventas from "../../../Models/Ventas";
import Toast from "../../../utils/toastUtil";
import DocumentViewer from "../../../components/DocumentosViewer";


const Cliente = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [cliente, setCliente] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)
    const [configColapse, setConfigColapse]= useState(false)
    const [clienteCollapse, setClienteCollapse]= useState({})
    const [router, setRouter]= useState({})
    const [routerSelect, selectRouter, setRouterSelect, ,setOptionsSelectRouter,,,,setDisabledRouter]= useAsyncSelect({
        labelPlace:'Router', modelo: {Model:Routers, respuesta: 'routersParam', getByParam: 'getByParam'},
    })
    const [fechaInicio, inputFechaInicio, setFechaInicio]= useInput({
        typeState: 'date', placeholder: 'Fecha Contrato', initialState: moment().format('YYYY-MM-DD')
    })
    const [, inputMonto, setMonto]= useInput({
         placeholder: 'Monto', disabled: true
    })
    const [, inputCodigoPago, setCodigoPago]= useInput({
        placeholder: 'Código pago', disabled: true
    })
    const [usuario, selectUsuario, setUsuario, , setOptionsUsuario,,,,setDisableUsuario]= useAsyncSelect({
        labelPlace:'Vendedor', modelo: {Model:Vendedores, respuesta: 'vendedoresParam'},
    })
    const colorState = {
        ACTIVO: 'success',
        BLOQUEADO: 'error',
        INACTIVO: 'error',
    };
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
        setTime(3)
    }, [buscar])
    useEffect(()=>{
        if(routerSelect && esUUID(routerSelect)){
            Routers.getById(routerSelect, 'codigo, precio_servicio')
                .then(response=>{
                    const routerId= response.data.routerById
                    setCodigoPago(routerId.codigo??'')
                    setMonto(routerId.precio_servicio??'')
                })
        }
    },[routerSelect])


    useEffect(() => {
        if(time>0)
        setLoading(true)
        Clientes.listaClientes(page, limit, buscar)
            .then(response => {
                const {clientes, info} = response.data.listaClientes.data
                setData(clientes)
                setInfoData(info)
                setLoading(false)
            })
    }, [limit, page, buscar, time])
    const editCliente = (row) => {
        setCliente(row)
        setConfig({...config, isOpen: true})
    }
    const editRouter=(row)=>{
        setRouter(row)
        setConfigColapse(true)
    }
    useEffect(()=>{
        const routerEdit= router.router??null
        setDisabledRouter(false)
        setDisableUsuario(false)
        setOptionsSelectRouter([])
        setRouterSelect(null)
        setOptionsUsuario([])
        setUsuario(null)
        setMonto('')
        setCodigoPago('')

        if(routerEdit){
            setOptionsSelectRouter([{value: routerEdit.id, label: `${routerEdit.marca}-${routerEdit.imei}`}])
            setRouterSelect(routerEdit.id)
            setDisabledRouter(true)
        }
        const vendedorEdit= router?.ventas? router.ventas[0].vendedor??null:null

        if(vendedorEdit){
            setOptionsUsuario([{value: vendedorEdit.id, label: `${vendedorEdit.documento_identidad}-${vendedorEdit.nombres}`}])
            setUsuario(vendedorEdit.id)
            setDisableUsuario(true)
        }
        setFechaInicio(router.fecha_inicio?? moment().format('YYYY-MM-DD'))
    },[router])
    const guardarRouterCliente= async ()=>{
        Toast.Waiting('Guardando...')
        let data={cliente_id: clienteCollapse.id, router_id: routerSelect, fecha_inicio:fechaInicio , vendedor: usuario}
        if(router.id) data={...data, id: router.id}
        try {
            await Ventas.createOrUpdateRouters(data)
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            window.location.reload()
        }catch (e) {
            Toast.Remove()
            Toast.Error(e.message)

        }
    }
    const handleCheckboxChange= async (gratis, id, setGratis)=>{
        Ventas.updateFree(id, gratis).then(()=>{
            setGratis(gratis)
        })
    }
    const rowCollapse = (row) => {
        setClienteCollapse(row)
        const dataRow= row.cliente_routers??[]
        return (
            <>
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        style={{margin: 3}}
                        onClick={()=> {
                            setConfigColapse(true)
                            setRouter({})
                        }}
                    >
                        <Icon icon="mdi:plus-circle"/> Nuevo Router
                    </Button>
                </Box>
                <ReactTablePagination data={dataRow}  columns={[
                    {
                        header: 'Acciones',
                        buttons: [
                            {
                                icon: 'mdi:account-edit',
                                onClick: (div) => editRouter(div), color: "warning"
                            },
                        ],
                        align: "center",

                    },
                    {
                        header: 'Excluir Pago',
                        Cell:(row)=>{
                            const [free, setFree]= useState(row.gratis?? false)
                            return(
                                    <input
                                        type="checkbox"
                                        checked={free}
                                        onChange={(e)=>handleCheckboxChange(e.target.checked, row.id, setFree)}
                                    />
                            )

                        },
                        align: "center",

                    },
                    {
                        header: 'IMEI',
                        accessor: 'imei',
                        align: "center",
                        Cell: (row) => {
                            const {imei} = row.router
                            return (<div>{imei??''}</div>)
                        },
                    },
                    {
                        header: 'Código Pago',
                        accessor: 'codigo',
                        align: "center",
                        Cell: (row) => {
                            const {codigo} = row.router
                            return (<div>{codigo??''}</div>)
                        },
                    },
                    {
                        header: 'SIM-CARD',
                        accessor: 'numero_chip',
                        align: "center",
                        Cell: (row) => {
                            const {chips} = row.router
                            const chipsValidos= chips.find(element=>element.activo && element.usado)
                            return (<div>{chipsValidos?.sim_card??''}</div>)
                        },
                    },
                    {
                        header: 'Marca',
                        accessor: 'marca',
                        align: "center",
                        Cell: (row) => {
                            const {marca} = row.router
                            return (<div>{marca??''}</div>)
                        },
                    },
                    {
                        header: 'Modelo',
                        accessor: 'modelo',
                        align: "center",
                        Cell: (row) => {
                            const {modelo} = row.router
                            return (<div>{modelo??''}</div>)
                        },
                    },
                ]}/>
            </>
        )
    }
    const [documentos, setDocumentos]= useState([])
    const [configView, setConfigView]= useState(false)
    const handleIconClick=(dni_back, dni_front)=>{
        const document=[]
        if(dni_front)document.push({nombre:'DNI Frontal', url: dni_front})
        if(dni_back)document.push({nombre: 'DNI Reverso', url: dni_back})
        setDocumentos(document)
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
                                setCliente({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo cliente
                        </Button>
                    </Box>
                    <ReactTablePagination data={data} setLimit={setLimit} loading={loading} info={infoData}
                                          setPage={setPage} pagination columns={[
                        {
                            header: '',
                            Cell: (row) => (
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setData((prevState) =>
                                            prevState.map((element) =>
                                                element.id === row.id ? {
                                                    ...element, open: !row.open, collapseElement: rowCollapse(row)
                                                } : {...element}
                                            )
                                        );
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.stopPropagation();
                                            setData((prevState) =>
                                                prevState.map((element) =>
                                                    element.id === row.id ? {...element, open: !row.open} : {...element}
                                                )
                                            );
                                        }
                                    }}
                                    style={{cursor: 'pointer'}}
                                >
                                     {row.open ? '👇' : '👉'}
                                 </span>
                            ),
                            cellStyle: {minWidth: '10px'},
                            align: "center",
                        },
                        {
                            header: '#',
                            accessor: 'nroComprobante',
                            Cell: (row) => data.indexOf(row) + 1 + (page ? (page - 1) * limit : 0),
                            align: "center",
                        },
                        {
                            header: ' ',
                            Cell: (row) => {
                                const {dni_back, dni_front} = row
                                return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {(dni_back || dni_front) && (
                                        <IconButton
                                            title="Ver detalle"
                                            component="label"
                                            onClick={() => handleIconClick(dni_back, dni_front)}
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
                            header: 'Estado',
                            accessor: 'estado',
                            align: "center",
                            Cell: (row)=>{
                                const {estado}= row
                                return <Label variant="soft" color={colorState[estado.toUpperCase()]} sx={{textTransform: 'capitalize'}}>
                                    {estado}
                                </Label>
                            }
                        },
                        {
                            header: 'Documento',
                            accessor: 'documento_identidad',
                            align: "center",
                        },
                        {
                            header: 'Nombre',
                            Cell: (row) => {
                                const {nombres} = row
                                return (<div>{nombres}</div>)
                            },
                            align: "center",
                        }, {
                            header: 'Departamento',
                            Cell: (row) => {
                                const {departamento} = row
                                return (
                                    <div>{(departamentos.find(el => el.id_ubigeo === departamento))['nombre_ubigeo']}</div>)
                            },
                            align: "center",
                        }, {
                            header: 'Provincia',
                            Cell: (row) => {
                                const {departamento, provincia} = row
                                return (<div>
                                    {(provincias[departamento].find(el => el.id_ubigeo === provincia))['nombre_ubigeo']}
                                </div>)
                            },
                            align: "center",
                        },
                        {
                            header: 'Distrito',
                            Cell: (row) => {
                                const {provincia, distrito} = row
                                return (<div>
                                    {(distritos[provincia].find(el => el.id_ubigeo === distrito))['nombre_ubigeo']}
                                </div>)
                            },
                            align: "center",
                        }
                    ]}/>
                </CardContent>
            </Card>
            <ModalClientes config={config} setConfig={setConfig} cliente={cliente}
                           setData={setData}
            />
            <DocumentViewer documentos={documentos} config={configView} setConfig={setConfigView}/>
            <Dialog open={configColapse} fullWidth>
                <DialogTitle>
                    {router?.id ? 'Editar Router' : 'Registar Router'}
                </DialogTitle>
                <DialogContent style={{paddingTop: 8}}>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 2}}>
                            {selectRouter}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            {inputMonto}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            {inputCodigoPago}
                        </FormControl>
                    </Stack>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 2}}>
                            {selectUsuario}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            {inputFechaInicio}
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant="contained"
                        color="success"
                        // disabled={disabledSave}
                        onClick={() => guardarRouterCliente()}
                    >
                        Guardar
                    </LoadingButton>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setConfigColapse(false)
                        }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
export default Cliente