import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import useInput from "../../../customHooks/useInput";
import useSelectMulti from "../../../customHooks/useSelectMulti";
import {useAuthContext} from "../../../auth/useAuthContext";
import {useCallback, useEffect} from "react";
import moment from "moment";
import Rol from "../../../Models/Rol";
import useSelect from "../../../customHooks/useSelect";
import useInputGroup from "../../../customHooks/useInputGroup";
import Usuario from "../../../Models/Usuario";
import useInputPass from "../../../customHooks/useInputPass";
import Toast from "../../../utils/toastUtil";


const ModalUser = ({config, user, setConfig, setData}) => {
    ModalUser.propTypes = {
        config: PropTypes.object,
        user: PropTypes.object,
        setConfig: PropTypes.func,
        setData: PropTypes.func
    }
    const {sesion} = useAuthContext();
    const [nombres, inputNombres, setNombres, setInvalidNombres, , invalidNombres] = useInput({
        placeholder: "Nombres",
    })
    const [apellidos, inputApellidos, setApellidos, setInvalidApellidos, , invalidApellidos] = useInput({
        placeholder: "Apellidos",
    })
    const [fecha, inputFecha, setFecha, setInvalidFecha, , invalidFecha] = useInput({
        placeholder: "F.Registro", typeState: 'date', initialState: moment().format('YYYY-MM-DD')
    })
    const [sedes, selectSedes, setSedes, setInvalidSedes, , , invalidSedes] = useSelectMulti({
        placeholder: "Sedes", optionsState: [...sesion.sedes.map(element => {
            return {value: element.id, label: element.nombre}
        })], initialState: ['85638fc8-3d06-46b5-bfab-e358b28f5df3']
    })
    const [rol, selectRol, setRol, setInvalidRoles, setOptionRoles, , invalidRol] = useSelect({
        placeholder: 'Rol'
    })
    const [pass, inputPass,setPass , setInvalidPass, , invalidPass] = useInputPass({
        placeholder: 'Contraseña',
    })
    const [checkPass, inputCheckPass,setCheckPass , setInvalidCheckPass, setMessageCheckPass, invalidCheck] = useInputPass({
        placeholder: 'Confirmar contraseña',
    })
    const [correo, inputCorreo, setCorreo, setInvalidCorreo, , invalidCorreo] = useInput({
        placeholder: 'Correo'
    })
    const [cuenta, inputCuenta, setCuenta, setInvalidCuenta, , invalidCuenta] = useInput({
        placeholder: 'Cuenta'
    })
    const [dni, inputDni, setDNI, setInvalidDni, , invalidDni] = useInputGroup({
        placeholder: "Documento de identidad", onClick: () => {
            if (dni.length === 8) {
                Toast.Waiting('Buscando...')
                Usuario.getDni(dni)
                    .then(response => {
                        const {data} = response.data.consultDNI.data
                        if (!data.error) {
                            setApellidos(data.apellidos ?? '')
                            setNombres(data.nombres ?? '')
                            Toast.Remove()
                            return
                        }
                        Toast.Remove()
                        Toast.Warning(data.error ?? 'No se Encontraron datos')
                    })
            }
        }
    })
    const isSave = () => {
        const nombresInvalidos = nombres === '';
        const apellidosInvalidos = apellidos === '';
        const cuentaCorreoInvalidos = !(correo !== '' || cuenta !== '');
        const correoInvalido = !(correo !== '' || cuenta !== '');
        const passInvalido = !user?.id ? pass === '' : false;
        const checkPassInvalido = pass !== '' && pass !== checkPass;
        const dniInvalido = dni === '';
        const rolInvalido = rol === ''
        const fechaInvalido = fecha === ''
        const sedesInvalido = sedes.length === 0

        return !(nombresInvalidos || apellidosInvalidos || dniInvalido || cuentaCorreoInvalidos || correoInvalido || checkPassInvalido || passInvalido || rolInvalido || fechaInvalido || sedesInvalido)
    }

    useEffect(() => {
        setDNI(user.documento_identidad ?? '')
        setNombres(user.nombres ?? '')
        setApellidos(user.apellidos ?? '')
        setCheckPass('')
        setPass('')
        setFecha(user.fecha_creacion ?? moment().format('YYYY-MM-DD'))
        setSedes(user.sedes ? user.sedes.map(element => element.id) : [])
        setRol(user.rol_id ?? '')
        setCorreo(user.correo ?? '')
        setCuenta(user.cuenta ?? '')
    }, [setApellidos, setCheckPass, setCorreo, setCuenta, setDNI, setFecha, setNombres, setPass, setRol, setSedes, user])
    const validate = useCallback(() => {
        setInvalidNombres(nombres === '')
        setInvalidApellidos(apellidos === '')
        setInvalidCuenta(!(correo !== '' || cuenta !== ''))
        setInvalidCorreo(!(correo !== '' || cuenta !== ''))
        setInvalidPass(!user?.id ? pass === '' : false)
        setInvalidCheckPass(pass !== '' && pass !== checkPass)
        setMessageCheckPass('Las contraseñas no coinciden')
        setInvalidDni(dni === '')
        setInvalidSedes(sedes.length === 0)
        setInvalidFecha(fecha === '')
        setInvalidRoles(rol === '')
    }, [apellidos, checkPass, correo, cuenta, dni, fecha, nombres, pass, rol, sedes.length, setInvalidApellidos, setInvalidCheckPass, setInvalidCorreo, setInvalidCuenta, setInvalidDni, setInvalidFecha, setInvalidNombres, setInvalidPass, setInvalidRoles, setInvalidSedes, setMessageCheckPass, user?.id])

    useEffect(() => {
        if (invalidNombres || invalidApellidos || invalidDni || invalidCuenta || invalidCorreo || invalidCheck || invalidPass || invalidFecha || invalidRol || invalidSedes) validate()
    }, [invalidApellidos, invalidCheck, invalidCorreo, invalidCuenta, invalidDni, invalidNombres, invalidPass, invalidFecha, validate, invalidRol, invalidSedes])
    useEffect(() => {
        Rol.getRoles('id, nombre, descripcion')
            .then(response => {
                const {listRol} = response.data
                let rols = []
                for (const element of listRol) {
                    rols = [...rols, {value: element.id, label: element.nombre}]
                }
                setOptionRoles(rols)
            })
    }, [setOptionRoles])


    const guardar = async () => {
        await validate()
        const save = await isSave()
        if (!save) return
        Toast.Waiting('Guardando...')
        const object = user?.id ? {
            id: user.id,
            documento_identidad: dni,
            nombres,
            apellidos,
            fecha_creacion: fecha,
            sedes,
            rol_id: rol,
            correo,
            cuenta, password: pass === '' || !pass ? null : pass
        } : {
            documento_identidad: dni,
            nombres,
            apellidos,
            fecha_creacion: fecha,
            sedes,
            rol_id: rol,
            correo,
            cuenta, password: pass
        }
        Toast.Remove()
        try {
            const {data} = await Usuario.createOrUpdate(object, 'id, correo, documento_identidad,cuenta, nombres, apellidos, sedes{id, nombre, codigo}, rol_id, fecha_creacion')
            const usuario = data.createOrUpdate
            if (user.id) {
                setData(prev => prev.map(element => element.id === user.id ? {...usuario} : {...element}))
                setConfig({...config, isOpen: false})
                return
            }
            setData(prev => [{...usuario},...prev])
            setConfig({...config, isOpen: false})
            Toast.Success('Guardado exitoso')
        }catch (e){
            Toast.Error(e.message)
        }

    }
    return (
        <Dialog open={config.isOpen} fullWidth
                maxWidth="sm">
            <DialogTitle>
                {user?.id ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogContent>
                <br/>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputDni}
                    {inputFecha}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputNombres}
                    {inputApellidos}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputCorreo}
                    {inputCuenta}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputPass}
                    {inputCheckPass}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {selectSedes}
                    {selectRol}
                </Stack>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    color="success"
                    onClick={() => guardar()}
                >
                    Aceptar
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
export default ModalUser