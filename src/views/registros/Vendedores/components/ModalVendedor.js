import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, Stack,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import useInput from "../../../../customHooks/useInput";
import useInputGroup from "../../../../customHooks/useInputGroup";
import useSelect from "../../../../customHooks/useSelect";
import {departamentos, distritos, paisesSudamerica, provincias} from "../../../../utils/constantes";
import {useEffect, useState} from "react";
import Toast from "../../../../utils/toastUtil";
import Usuario from "../../../../Models/Usuario";
import Vendedores from "../../../../Models/Vendedores";

const ModalVendedor= ({config, vendedor, setConfig, setData})=>{
    ModalVendedor.propTypes={
        config: PropTypes.object,
        vendedor: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }
    const [nombres, inputNombres, setNombres, setInvalidNombres, , invalidNombres] = useInput({
        placeholder: "Nombres y apellidos/Razón social",
    })
    const [dni, inputDni, setDNI, setInvalidDni, , invalidDni] = useInputGroup({
        placeholder: "Documento de identidad", onClick: () => {
            setNombres('')
            Toast.Waiting('Buscando...')
            Usuario.consultDNIRUC(dni)
                .then(response => {
                    const {data, success} = response.data.consultDNIRUC.data
                    if(!success){
                        Toast.Remove()
                        Toast.Warning(data.error ?? 'No se Encontraron datos')
                        return
                    }
                    if (!data.error) {
                        setNombres(data.datos ?? '')
                        Toast.Remove()
                        return
                    }
                    Toast.Remove()
                    Toast.Warning(data.error ?? 'No se Encontraron datos')
                })
        }
    })
    const [departamento, selectDepartamento, setDepartamento, setInvalidDepartamento] = useSelect({
        placeholder: 'Departamento'
        , optionsState: departamentos.map(element => {
            return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
        })
    })
    const [provincia, selectProvincia, setProvincia, setInvalidProvincia, setOptionsProvincia, , , setDisabledProvincia] = useSelect({
        placeholder: 'Provincia'
    })
    const [distrito, selectDistrito, setDistrito, setInvalidDistrito, setOptionsDistrito, , , setDisabledDistrito] = useSelect({
        placeholder: 'Distrito'
    })
    const [direccion, inputDireccion, setDireccion, setInvalidDireccion] = useInput({
        placeholder: "Calle | Avenida | Jr."
    })
    const [nro, inputNro, setNro, setInvalidNro] = useInput({
        placeholder: 'N°', typeState: 'number'
    })
    const [nacionalidad, selectNacionalidad, setNacionalidad, setInvalidNacionalidad, setOptionsNacionalidad] = useSelect({
        placeholder: 'Nacionalidad',
    })
    const [disabledSave, setDisabledSave] = useState(false)
    useEffect(() => {
        let options = []
        for (const codigo in paisesSudamerica) {
            options.push({label: paisesSudamerica[codigo], value: codigo})
        }
        setOptionsNacionalidad(options)
        setNacionalidad('PE')
    }, [])
    useEffect(() => {
        setNombres(vendedor.nombres ?? '')
        setDNI(vendedor.documento_identidad ?? '')
        setDepartamento(vendedor.departamento ?? '')
        setDireccion(vendedor.direccion ?? '')
        setNro(vendedor.numero_direccion ?? '')
        setNacionalidad(vendedor.nacionalidad ?? 'PE')
    }, [vendedor])
    useEffect(() => {
        if (vendedor.id) {
            if (vendedor.provincia) {
                const optionsP = provincias[vendedor.departamento].map(element => {
                    return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
                })
                setOptionsProvincia(optionsP)
                setProvincia(vendedor.provincia ?? '')
            }
            if (vendedor.distrito) {
                const options = distritos[vendedor.provincia].map(element => {
                    return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
                })
                setOptionsDistrito(options)
                setDistrito(vendedor.distrito ?? '')

            }
        }
    }, [vendedor, provincia, distrito])
    useEffect(() => {
        const invalidNombres = nombres === ''
        const invalidDni = dni === ''
        const invalidDepartamento = departamento === ''
        const invalidProvincia = provincia === ''
        const invalidDistrito = distrito === ''
        const invalidDireccion = direccion === ''
        const invalidNro = nro === ''
        const invalidNacionalidad = nacionalidad === ''
        setInvalidDni(invalidDni)
        setInvalidNombres(invalidNombres)
        setInvalidDepartamento(invalidDepartamento)
        setInvalidProvincia(invalidProvincia)
        setInvalidDistrito(invalidDistrito)
        setInvalidDireccion(invalidDireccion)
        setInvalidNro(invalidNro)
        setInvalidNacionalidad(invalidNacionalidad)
        setDisabledSave( invalidNacionalidad || invalidDni
            || invalidNombres || invalidDepartamento || invalidProvincia || invalidDistrito || invalidDireccion || invalidNro)
    }, [nombres, dni, departamento, provincia, distrito, direccion, nro, nacionalidad])
    useEffect(() => {
        if (!departamento || departamento === '') {
            setOptionsProvincia([])
            setProvincia('')
            setDisabledProvincia(true)
            return
        }
        setProvincia('')
        setOptionsProvincia([])
        setDistrito('')
        setOptionsDistrito([])
        setDisabledProvincia(false)
        const options = provincias[departamento].map(element => {
            return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
        })
        setOptionsProvincia(options)
    }, [departamento])
    useEffect(() => {
        if (!provincia || provincia === '') {
            setOptionsDistrito([])
            setDistrito('')
            setDisabledDistrito(true)
            return
        }
        setDistrito('')
        setOptionsDistrito([])
        setDisabledDistrito(false)
        const options = distritos[provincia].map(element => {
            return {value: element["id_ubigeo"], label: element["nombre_ubigeo"]}
        })
        setOptionsDistrito(options)
        if (vendedor.distrito) setDistrito(vendedor.distrito)
    }, [provincia, vendedor])
    const guardar= async ()=>{
        Toast.Waiting('Guardando...')
        let object = {
            documento_identidad: dni, direccion, numero_direccion: nro,
            nacionalidad, nombres, provincia, departamento, distrito
        }
        if(vendedor.id)object = {...object, id: vendedor.id}
        try {
            const {data}= await Vendedores.createOrUpdate(object, 'id,documento_identidad,direccion,numero_direccion,nombres,provincia,departamento,distrito,estado,nacionalidad')
            const newVendedor= data.createOrUpdateVendedores
            if(vendedor.id){
                setData(prev => prev.map(element => element.id === vendedor.id ? {...newVendedor} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                return
            }
            setData(prev => [{...newVendedor}, ...prev])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})
        }catch (e) {
            Toast.Remove()
            Toast.Error(e.message)
        }
    }

    return(
        <Dialog open={config.isOpen} fullWidth
                maxWidth="md">
            <DialogTitle>
                {vendedor?.id ? 'Editar Vendedor' : 'Nuevo Vendedor'}
            </DialogTitle>
            <DialogContent>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 1}}>
                        {inputDni}
                    </FormControl>
                    <FormControl style={{flex: 2}}>
                        {inputNombres}
                    </FormControl>
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {selectDepartamento}
                    {selectProvincia}
                    {selectDistrito}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    <FormControl style={{flex: 3, border: '1px solid #ccc', borderRadius: '8px', padding: '10px'}}>
                        <Typography variant="h6" gutterBottom>
                            Datos adicionales
                        </Typography>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingTop: '5%', margin: 0}} spacing={1}>
                            <FormControl style={{flex: 8, padding: 1, margin: 1}}>
                                {inputDireccion}
                            </FormControl>
                            <FormControl style={{flex: 3, padding: 1, margin: 1}}>
                                {inputNro}
                            </FormControl>
                        </Stack>
                        <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingTop: '2%'}} spacing={2}>
                            {selectNacionalidad}
                        </Stack>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    disabled={disabledSave}
                    onClick={() => guardar()}
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
    )

}
export default ModalVendedor

