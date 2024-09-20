import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import {Box, Button, Card, CardContent, Container} from "@mui/material";
import {Icon} from "@iconify/react";
import Usuario from "../../../Models/Usuario";
import Routers from "../../../Models/Routers";

import moment from "moment";
import Sims from "../../../Models/Sims";
import ModalSims from "./components/ModalSims";

const Sim = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [sedes, setSedes]= useState([])
    const [chip, setChip] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
       setLoading(true)
       Sims.listSims(page, limit)
           .then(response=>{
               const {allChips, info} = response.data.listChips.data
               setData(allChips)
               setInfoData(info)
               setLoading(false)
           })
    },[])

    const editChip = (row) => {
        setChip(row)
        setConfig({...config, isOpen: true})
    }
    useEffect(() => {
        Usuario.allSedes().then(response => {
            const {allSedes} = response.data
            setSedes(allSedes.filter(element=>element.almacen))
        })
    }, [])
    const rowCollapse = (row) => {

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
                                setChip({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo Chip
                        </Button>

                    </Box>
                    <ReactTablePagination data={data} setLimit={setLimit} loading={loading} info={infoData}
                                          setPage={setPage} pagination columns={[
                        {
                            header: '',
                            Cell: (row) => {
                                return (<span
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
                                 </span>)
                            },
                            cellStyle: {minWidth: '10px'},
                            align: "center",
                        },
                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => editChip(div), color: "warning"
                                },
                            ],
                            align: "center",
                        },
                        {
                            header: 'SIM CARD',
                            accessor: 'sim_card',
                            align: "center",
                        },
                        {
                            header: 'MARCA',
                            accessor: 'marca',
                            align: "center",
                        },
                        {
                            header: 'PAQUETE',
                            accessor: 'paquete',
                            align: "center",
                        },
                        {
                            header: 'SEDE',
                            Cell: (row) => {
                                const {sede_id} = row
                                const elemento= sedes.find(element=>element.id===sede_id)
                                return (<div>{elemento.nombre}</div>)
                            },
                            align: "center",
                        },
                        {
                            header: 'ESTADO',
                            accessor: 'estado',
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
            <ModalSims setData={setData} config={config} setConfig={setConfig} sedes={sedes} sim={chip}/>
        </Container>
    )


}
export default Sim