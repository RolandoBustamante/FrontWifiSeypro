import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../../utilsComponents/CustomTable";
import Toast from "../../../../utils/toastUtil";

import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    TableCell
} from "@mui/material";
import {Icon} from "@iconify/react";
import {useTheme} from "@mui/system";
import useSelect from "../../../../customHooks/useSelect";
import useInput from "../../../../customHooks/useInput";
import {LoadingButton} from "@mui/lab";
import Vehiculos from "../../../../Models/Vehiculos";
import {element} from "prop-types";

const TipoVehiculos = () => {
    const [tipoVehiculo, setTipoVehiculo] = useState({})
    const [dataTipoVehiculo, setDataTipoVehiculo] = useState([])
    const [infoTipoVehiculo, setInfoTipoVehiculo] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tipo, inputTipo, setTipo] = useInput({
        typeState: 'text', placeholder: 'Tipo de vehículo/Maquinaria'
    })
    const [condicion, selectCondicion, setCondicion] = useSelect({
        optionsState: [{label: 'Nuevo', value: 'Nuevo'}, {label: 'Usado', value: 'Usado'},
            {label: 'Importado', value: 'Importado'}, {label: 'Propio', value: 'Propio'},
            {label: 'Alquilado', value: 'Alquilado'}
        ]
    })
    useEffect(() => {
        setLoading(true)
        Vehiculos.listTipos(page, limit)
            .then(response => {
                const {allElementos, info} = response.data.listTipo.data
                setDataTipoVehiculo(allElementos)
                setInfoTipoVehiculo(info)
                setLoading(false)
            })
    }, [page, limit])
    useEffect(() => {
        setTipo(tipoVehiculo.nombre ?? '')
        setCondicion(tipoVehiculo.condicion ?? '')
    }, [tipoVehiculo])

    const editarTipo = (row) => {
        setTipoVehiculo(row)
    }
    const save = async () => {
        if (tipo === '' || condicion === '') {
            Toast.Warning("Complete los datos antes de guardar")
            return
        }
        Toast.Waiting('Guardando...')
        let object = {
            nombre: tipo, condicion
        }
        if (tipoVehiculo.id) object = {...object, id: tipoVehiculo.id}
        const {data} = await Vehiculos.createOrUpdateTipo(object)
        const newTipo = data.createOrUpdateTipo
        if (tipoVehiculo.id) {
            setDataTipoVehiculo(prevState => prevState.map(element => element.id === tipoVehiculo.id ? {...newTipo} : {...element}))
            Toast.Remove()
            Toast.Success('Guardado exitoso')
        } else {
            setDataTipoVehiculo(prevState => [{...newTipo}, ...prevState])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
        }
        setTipoVehiculo({})

    }
    return (
        <Container>
            <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                <FormControl style={{flex: 6, marginTop: 15}}>
                    <ReactTablePagination data={dataTipoVehiculo} loading={loading} setLimit={setLimit}
                                          setPage={setPage} info={infoTipoVehiculo} pagination columns={[
                        {
                            header: '#',
                            accessor: 'nroComprobante',
                            Cell: (row) => dataTipoVehiculo.indexOf(row) + 1 + page,
                            align: "center",
                        },
                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => editarTipo(div), color: "warning"
                                },
                            ],
                            align: "center",
                            cellStyle: {minWidth: '10px'},

                        },
                        {
                            header: "Tipo Vehículo/Maquinaria",
                            align: "center",
                            accessor: 'nombre',
                        },
                        {
                            header: "Condición",
                            align: "center",
                            accessor: 'condicion',
                        }
                    ]}
                    />
                </FormControl>
                <FormControl style={{flex: 2}}>
                    <Box display="flex" justifyContent="center" marginTop={0}>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            style={{margin: 3}}
                            onClick={() => save()}>
                            <Icon icon="mdi:content-save"/> {!tipoVehiculo.id ? "Registrar" : "Editar"}
                        </Button>
                    </Box>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 10}}
                           spacing={2}>
                        {inputTipo}
                    </Stack>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 10}}
                           spacing={2}>
                        {selectCondicion}
                    </Stack>
                </FormControl>
            </Stack>
        </Container>
    )

}
export default TipoVehiculos