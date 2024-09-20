import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,

} from "@mui/material";
import {Icon} from "@iconify/react";
import {departamentos, distritos, provincias} from "../../../utils/constantes";
import Retails from "../../../Models/Vendedores"
import Label from "../../../components/label";
import ModalVendedor from "./components/ModalVendedor";

const Vendedores= ()=>{
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)
    const [vendedor, setVendedor]= useState({})
    const colorState = {
        ACTIVO: 'success',
        BLOQUEADO: 'error',
        INACTIVO: 'error',
    };

    useEffect(()=>{
        setLoading(true)
        Retails.listaVendedores(page, limit)
            .then(response => {
                const {data} = response.data.listVendedores
                setData(data.vendedores)
                setInfoData(data.info)
                setLoading(false)
            })
    },[limit, page])
    const editVendedor= (row)=>{
        setVendedor(row)
        setConfig({...config, isOpen: true})
    }

    return(
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
                                setVendedor({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo Vendedor
                        </Button>
                    </Box>
                    <ReactTablePagination data={data} setLimit={setLimit} loading={loading} info={infoData}
                                          setPage={setPage} pagination columns={[
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
                                    onClick: (div) => editVendedor(div), color: "warning"
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
            <ModalVendedor config={config} setConfig={setConfig} setData={setData} vendedor={vendedor}/>

        </Container>
    )
}
export default Vendedores
