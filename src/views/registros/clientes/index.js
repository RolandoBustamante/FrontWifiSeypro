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
    FormControl,
    Stack
} from "@mui/material";
import {Icon} from "@iconify/react";
import ModalClientes from "./components/ModalClientes";
import Clientes from "../../../Models/Clientes";
import {departamentos, distritos, provincias} from "../../../utils/constantes";
import useAsyncSelect from "../../../customHooks/useAsyncSelect";
import useSelect from "../../../customHooks/useSelect";
import useInput from "../../../customHooks/useInput";
import moment from "moment";
import {LoadingButton} from "@mui/lab";
import Rol from "../../../Models/Rol";
import Vehiculos from "../../../Models/Vehiculos";


const Cliente = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [cliente, setCliente] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)
    const [configColapse, setConfigColapse]= useState(false)
    const [dataVenta, setDataVenta]= useState([])
    const [vehiculo, setVehiculo]= useState({})
    const [clienteCollapse, setClienteCollapse]= useState({})
    const [vehiculoSelect, selectVehiculo, setVehiculoSelect]= useAsyncSelect({
        labelPlace:'Vehiculo', modelo: {Model:Vehiculos, respuesta: 'vehiculosParaUso', getByParam: 'vehiculosParaUso'},
    })
    const [venta, selectVenta, setVenta,,setOptionsVenta]=useSelect({
        placeholder:'Tipo de venta'
    })
    const [monto, inputMonto, setMonto]= useInput({
        typeState: 'number', placeholder: 'Monto'
    })
    const [fechaInicio, inputFechaInicio, setFechaInicio]= useInput({
        typeState: 'date', placeholder: 'Fecha Contrato', initialState: moment().format('YYYY-MM-DD')
    })
    useEffect(()=>{
       Rol.getListTipoVentaVehiculo()
           .then(response=>{
               const{listTipoVentaVehiculo}= response.data
               setDataVenta(listTipoVentaVehiculo)
               const optionsVentas= []
               for(const element of listTipoVentaVehiculo){
                   optionsVentas.push({value: element.id, label: element.nombre})
               }
               setOptionsVenta(optionsVentas)
           })
    },[setOptionsVenta])
    useEffect(() => {
        setLoading(true)
        Clientes.listaClientes(page, limit)
            .then(response => {
                const {clientes, info} = response.data.listaClientes.data
                setData(clientes)
                setInfoData(info)
                setLoading(false)
            })
    }, [limit, page])
    const editCliente = (row) => {
        setCliente(row)
        setConfig({...config, isOpen: true})
    }
    const rowCollapse = (row) => {
        setClienteCollapse(row)
        const dataRow= row.data??[]
        return (
            <>
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        style={{margin: 3}}
                        onClick={()=>setConfigColapse(true)}
                    >
                        <Icon icon="mdi:plus-circle"/> Nuevo Vehiculo
                    </Button>
                </Box>
                <ReactTablePagination data={dataRow}  columns={[
                    {
                        header: 'Placa',
                        accessor: 'placa',
                        align: "center",
                    },
                    {
                        header: 'Tipo Vehículo',
                        Cell: (row) => {
                            const {tipo} = row
                            const nombre = tipo.nombre ?? ''
                            return (<div>{nombre}</div>)
                        },
                        align: "center",
                    },
                    {
                        header: 'Marca',
                        Cell: (row) => {
                            const {marca} = row
                            const nombre = marca.nombre ?? ''
                            return (<div>{nombre}</div>)
                        },
                        align: "center",
                    },
                    {
                        header: 'Color',
                        accessor: 'color',
                        align: "center",
                    },
                    {
                        header: 'Sede',
                        Cell: (row) => {
                            const {sede} = row
                            const nombre = sede.nombre ?? ''
                            return (<div>{nombre}</div>)
                        },
                        align: "center",
                    }
                ]}/>
            </>
        )
    }
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
                        },
                        {
                            header: 'DNI',
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
            <Dialog open={configColapse} fullWidth>
                <DialogTitle>
                    {vehiculo?.id ? 'Editar Vehiculo' : 'Registar Vehiculo'}
                </DialogTitle>
                <DialogContent style={{paddingTop: 8}}>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 1}}>
                            {selectVehiculo}
                        </FormControl>
                        <FormControl style={{flex: 2}}>
                            {selectVenta}
                        </FormControl>
                    </Stack>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        {inputMonto}
                        {inputFechaInicio}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant="contained"
                        color="success"
                        // disabled={disabledSave}
                        // onClick={() => guardar()}
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