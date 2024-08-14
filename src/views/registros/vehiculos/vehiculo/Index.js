import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../../utilsComponents/CustomTable";
import {Box, Button, Container} from "@mui/material";
import {Icon} from "@iconify/react";
import ModalVehiculo from "./components/ModalVehiculo";
import Vehiculos from "../../../../Models/Vehiculos";


const Vehiculo = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [vehiculo, setVehiculo] = useState({})
    const [info, setInfo] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)
        Vehiculos.listVehiculos(page, limit)
            .then(response => {
                const {vehiculos, info} = response.data.listVehiculo.data
                setData(vehiculos)
                setInfo(info)
                setLoading(false)
            })
    }, [page, limit])
    const editarVehiculo = (row) => {
        setVehiculo(row)
        setConfig({...config, isOpen: true})
    }
    const rowCollapse = (row) => {

        const dataRow= row.data??[]
        return (
            <>
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        style={{margin: 3}}>
                        <Icon icon="mdi:plus-circle"/> Nuevo GPS
                    </Button>
                </Box>
                <ReactTablePagination data={dataRow}  columns={[
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
            </>
        )
    }
    return (
        <Container>
            <Box display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    style={{margin: 3}}
                    onClick={() => {
                        setVehiculo({})
                        setConfig({...config, isOpen: true})
                    }}>
                    <Icon icon="mdi:plus-circle"/> Nuevo Vehiculo
                </Button>
            </Box>
            <ReactTablePagination data={data} setLimit={setLimit} loading={loading} info={info}
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
                    Cell: (row) => data.indexOf(row) + 1 + (page ? (page - 1) * limit : 0),
                    align: "center",
                },
                {
                    header: 'Acciones',
                    buttons: [
                        {
                            icon: 'mdi:account-edit',
                            onClick: (div) => editarVehiculo(div), color: "warning"
                        },
                    ],
                    align: "center",

                },
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
                },
            ]}
            />
            <ModalVehiculo
                config={config} setConfig={setConfig} setData={setData} vehiculo={vehiculo}
            />
        </Container>
    )
}
export default Vehiculo