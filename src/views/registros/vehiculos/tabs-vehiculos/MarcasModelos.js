import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../../../utilsComponents/CustomTable";

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
} from "@mui/material";
import {Icon} from "@iconify/react";
import {useTheme} from "@mui/system";
import useSelect from "../../../../customHooks/useSelect";
import useInput from "../../../../customHooks/useInput";
import {LoadingButton} from "@mui/lab";
import Vehiculos from "../../../../Models/Vehiculos";
import Toast from "../../../../utils/toastUtil";


const MarcasModelos = () => {
    const [config, setConfig] = useState({isOpen: false})
    const [marcaModelo, setMarcaModelo] = useState({})
    const [tipo, selectTipo, setTipo,,,,,setDiabledTipo] = useSelect({
        optionsState: [{value: 1, label: 'Marca'}, {value: 2, label: 'Modelo'}], initialState: 1
    })
    const [disabledSave, setDisabledSave] = useState(false)

    const [nombre, inputNombre, setNombre] = useInput({
        typeState: 'text', placeholder: 'Nombre'
    })
    const [dataMarca, setDataMarca] = useState([])
    const [dataModelo, setDataModelo] = useState([])
    const [infoMarca, setInfoMarca] = useState({})
    const [infoModelo, setInfoModelo] = useState({})
    const [pageMarca, setPageMarca] = useState(null)
    const [limitMarca, setLimitMarca] = useState(10)
    const [pageModelo, setPageModelo] = useState(null)
    const [limitModelo, setLimitModelo] = useState(10)
    const [loadingMarca, setLoadingMarca] = useState(false)
    const [loadingModelo, setLoadingModelo] = useState(false)
    useEffect(() => {
        setLoadingModelo(true)
        Vehiculos.listMarcaModelo(pageModelo, limitModelo, 2).then(response => {
            const {allElemntos, info} = response.data.listMarcaModelo.data
            setDataModelo(allElemntos)
            setInfoModelo(info)
            setLoadingModelo(false)
        })

    }, [limitModelo, pageModelo])
    useEffect(() => {
        setLoadingMarca(true)
        Vehiculos.listMarcaModelo(pageModelo, limitModelo, 1).then(response => {
            const {allElemntos, info} = response.data.listMarcaModelo.data
            setDataMarca(allElemntos)
            setInfoMarca(info)
            setLoadingMarca(false)
        })

    }, [limitMarca, pageMarca])

    const editMarcaModelo = (row, mm) => {
        setDiabledTipo(true)
        setTipo(mm)
        setMarcaModelo(row)
        setConfig({...config, isOpen: true})

    }
    useEffect(()=>{
        setNombre(marcaModelo.nombre??'')
    },[marcaModelo])
    const theme = useTheme();
    const save = async () => {
        Toast.Waiting('Guardando...')
        let object = {
            nombre
        }
        if (marcaModelo.id) object = {...object, id: marcaModelo.id}
        const {data} = await Vehiculos.crearOrActualizar({data: {...object}, tipo})
        const newMarcaModelo= data.crearOActualizarModeloMarcas
        if(marcaModelo.id){
            if(tipo===1){
                setDataMarca(prev => prev.map(element => element.id === marcaModelo.id ? {...newMarcaModelo} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                return
            }
            setDataModelo(prev => prev.map(element => element.id === marcaModelo.id ? {...newMarcaModelo} : {...element}))
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
            return
        }
        if(tipo===1){
            setDataMarca(prevState => [{...newMarcaModelo}, ...prevState])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
        }else{
            setDataModelo(prevState => [{...newMarcaModelo}, ...prevState])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
        }

    }
    return (
        <Container>
            <Box display="flex" justifyContent="center" marginTop={2}>
                <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    style={{margin: 3}}
                    onClick={() => {
                        setDiabledTipo(false)
                        setMarcaModelo({})
                        setTipo(1)
                        setConfig({...config, isOpen: true})
                    }}>
                    <Icon icon="mdi:plus-circle"/> Nuevo Registro
                </Button>
            </Box>
            <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                <FormControl style={{flex: 2}}>
                    <Box display="flex" justifyContent="center" marginBottom={2}>
                        Marca
                    </Box>
                    <ReactTablePagination data={dataMarca} loading={loadingMarca} setLimit={setLimitMarca}
                                          setPage={setPageMarca} info={infoMarca} pagination columns={[
                        {
                            header: '#',
                            accessor: 'nroComprobante',
                            Cell: (row) =><div style={{margin: 0, padding: 0}}>
                                {dataMarca.indexOf(row) + 1+ pageMarca}
                            </div>,
                            align: "center",
                        },
                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => editMarcaModelo(div,1), color: "warning"
                                },
                            ],
                            align: "center",
                            cellStyle: {minWidth: '10px'},

                        },
                        {
                            header: "Marca",
                            align: "center",
                            accessor: 'nombre',
                        }
                    ]}
                    />

                </FormControl>
                <FormControl style={{flex: 2}}>
                    <Box display="flex" justifyContent="center" marginBottom={2}>
                        Modelo
                    </Box>
                    <ReactTablePagination data={dataModelo} loading={loadingModelo} setLimit={setLimitModelo}
                                          setPage={setPageModelo} info={infoModelo} pagination columns={[
                        {
                            header: '#',
                            accessor: 'nroComprobante',
                            Cell: (row) =><div style={{margin: 0, padding: 0}}>
                                {dataModelo.indexOf(row) + 1+pageModelo}
                            </div>,
                            align: "center",
                        },
                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => editMarcaModelo(div, 2), color: "warning"
                                },
                            ],
                            align: "center",
                            cellStyle: {minWidth: '10px'},
                        },
                        {
                            header: "Modelo",
                            align: "center",
                            accessor: 'nombre',
                        }
                    ]}/>
                </FormControl>
            </Stack>
            <Dialog open={config.isOpen} fullWidth
                    maxWidth="sm">
                <DialogTitle>
                    {marcaModelo?.id ? 'Editar' : 'Nuevo'}
                </DialogTitle>
                <DialogContent>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 10}}
                           spacing={2}>
                        <FormControl style={{flex: 2}}>
                            {selectTipo}
                        </FormControl>
                        <FormControl style={{flex: 2}}>
                            {inputNombre}
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant="contained"
                        color="success"
                        disabled={disabledSave}
                        onClick={() => save()}
                    >
                        Guardar
                    </LoadingButton>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setConfig({...config, isOpen: false})
                        }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>

    )

}
export default MarcasModelos