import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../utilsComponents/CustomTable";
import Toast from "../../../utils/toastUtil";

import {
    Box,
    Button, Card, CardContent,
    Container,
    FormControl, IconButton,
    Stack,
} from "@mui/material";
import {Icon} from "@iconify/react";
import useInput from "../../../customHooks/useInput";
import Label from "../../../../src/components/label";
import TipoVenta from "../../../Models/TipoVenta";
import useRadioButtons from "../../../customHooks/useRadioButtons";
import useMyDialog from "../../../customHooks/useMyDialog";


const TipoPago = () => {
    const {openDialog, MyDialog} = useMyDialog()

    const [tipoVenta, setTipoVenta] = useState({})
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [tipo, inputTipo, setTipo] = useInput({
        typeState: 'text', placeholder: 'Tipo de Pago'
    })
    const [selectedOption, RadioButtons, setRadio] = useRadioButtons('true', [
        {label: 'SI', value: 'true'},
        {label: 'NO', value:'false'}
    ], 'Bancarizado')
    useEffect(() => {
        setLoading(true)
        TipoVenta.getListTipoBancos()
            .then(response => {
                const {listTipoPago} = response.data
                setData(listTipoPago)
                setLoading(false)
            })
    }, [])
    useEffect(() => {
        setTipo(tipoVenta.nombre ?? '')
        setRadio(tipoVenta.bancarizado !==null?`${tipoVenta.bancarizado}`:'true')
    }, [tipoVenta])

    const editarTipo = (row) => {
        setTipoVenta(row)
    }
    const activarEliminarSolicitud = (row) => {
        const {activo} = row
        const object={...row, bancarizado: row.bancarizado==='true', activo: !activo}
        openDialog(!activo?'¿Desea  activar el tipo de pago?':'Desea  desactivar el tipo de pago', "¡No podrás revertir esto!", 'Aceptar', 'Cancelar')
            .then(async (result) => {
                if (result) {
                    Toast.Warning("PROCESANDO...")
                    const {data} = await TipoVenta.createOrUpdateTipoPago(object)
                    const newTipo = data.createOrUpdateTipoPago
                    setData(prevState => prevState.map(element => element.id === tipoVenta.id ? {...newTipo} : {...element}))
                    Toast.Remove()
                    Toast.Success('Guardado exitoso')
                }
            })
    }
    const save = async () => {
        if (tipo === '' ) {
            Toast.Warning("Complete los datos antes de guardar")
            return
        }
        Toast.Waiting('Guardando...')
        let object = {
            nombre: tipo, bancarizado: selectedOption==='true'
        }
        if (tipoVenta.id) object = {...object, id: tipoVenta.id}
        const {data} = await TipoVenta.createOrUpdateTipoPago(object)
        const newTipo = data.createOrUpdateTipoPago
        if (tipoVenta.id) {
            setData(prevState => prevState.map(element => element.id === tipoVenta.id ? {...newTipo} : {...element}))
            Toast.Remove()
            Toast.Success('Guardado exitoso')
        } else {
            setData(prevState => [{...newTipo}, ...prevState])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
        }
        setTipoVenta({})

    }
    return (
        <Container>
            <Card>
                <CardContent>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 6, marginTop: 15}}>
                            <ReactTablePagination data={data} loading={loading} columns={[
                                {
                                    header: 'N°',
                                    Cell: (row) => data.indexOf(row) + 1,
                                    align: "center",
                                },
                                {
                                    header: 'Acciones',
                                    Cell: (row)=>{
                                        const {activo}= row
                                        return(
                                            <div>
                                                <IconButton title="EDITAR" color="warning"
                                                            onClick={() => editarTipo(row)}>
                                                    <Icon icon='mdi:account-edit'/>
                                                </IconButton>
                                                {
                                                    activo && <IconButton title="DESACTIVAR" color="error"
                                                                          onClick={() => activarEliminarSolicitud(row)}>
                                                        <Icon icon='mdi:do-not-disturb'/>
                                                    </IconButton>
                                                }
                                                {
                                                    !activo && <IconButton title="ACEPTAR" color="success"
                                                                          onClick={() => activarEliminarSolicitud(row)}>
                                                        <Icon icon='mdi:check-circle'/>
                                                    </IconButton>
                                                }
                                            </div>
                                        )
                                    },
                                    align: "center",
                                    cellStyle: {minWidth: '10px'},

                                },
                                {
                                    header: "Tipo Pago",
                                    align: "center",
                                    accessor: 'nombre',
                                },
                                {
                                    header: "Estado",
                                    align: "center",
                                    Cell: (row) => {
                                        const {activo} = row
                                        return <Box>
                                            <Label variant="soft" color={activo?'success': 'error'} sx={{textTransform: 'capitalize'}}>
                                                {activo? 'ACTIVO': 'DESACTIVADO'}
                                            </Label>
                                        </Box>
                                    },
                                },
                                {
                                    header: "Bancarizado",
                                    align: "center",
                                    Cell: (row) => {
                                        const {bancarizado} = row
                                        return <Box>
                                            <Label variant="soft" color={'info'} sx={{textTransform: 'capitalize'}}>
                                                {bancarizado==='true'? 'SI': 'NO'}
                                            </Label>
                                        </Box>
                                    },
                                }
                            ]}
                            />
                        </FormControl>
                        <FormControl style={{flex: 2,  border: "1px solid #ccc", borderRadius: 5, padding: 10}}>
                            <Box display="flex" justifyContent="center" marginTop={0}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    style={{margin: 3}}
                                    onClick={() => save()}>
                                    <Icon icon="mdi:content-save"/> {!tipoVenta.id ? "Registrar" : "Editar"}
                                </Button>
                            </Box>
                            <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 10}}
                                   spacing={2}>
                                {inputTipo}
                            </Stack>
                            <Stack  direction={{ xs: 'column', sm: 'row' }}
                                    style={{ paddingBottom: 10, paddingTop: 10 }}
                                    spacing={2}
                                    alignItems="center"
                                    justifyContent="center" >
                                <RadioButtons/>
                            </Stack>

                        </FormControl>
                    </Stack>
                </CardContent>
            </Card>
            <MyDialog/>
        </Container>
    )

}
export default TipoPago