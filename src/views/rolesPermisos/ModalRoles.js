import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PropTypes from 'prop-types';
import useInput from "../../customHooks/useInput";
import menuItems from "../../menu-items";
import React, {Fragment, useEffect, useState} from "react";
import Rol from "../../Models/Rol";
import Toast from "../../utils/toastUtil";
import useSwitch from "../../customHooks/useSwitch";

const normalizeRoleName = (value = "") =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

const ModalRoles = ({config, setConfig, rol, setRoles}) => {
    ModalRoles.propTypes = {
        config: PropTypes.object,
        rol: PropTypes.object,
        setConfig: PropTypes.func,
        setRoles: PropTypes.func
    }
    const menu = menuItems
    const [data, setData] = useState([])

    const [nombre, inputNombre, setNombre, , ,] = useInput({
        placeholder: "Nombre",
    })
    const [descripcion, inputDescripcion, setDescripcion, , ,] = useInput({
        placeholder: "Descripción",
    })
    const [esRepartidor, switchRepartidor, setEsRepartidor, setDisabledSwitch] = useSwitch({initialState: false})
    const [accesos, setAccesos] = useState([])
    const [disabled, setDisabled] = useState(false)
    useEffect(() => {
        setDisabled(rol && rol.id === 'd10503e9-847b-48d6-a9ff-a0f182974300')
        setNombre(rol.nombre ?? '')
        setDescripcion(rol.descripcion ?? '')
        setEsRepartidor(Boolean(rol.es_repartidor))
        setDisabledSwitch(rol && rol.id === 'd10503e9-847b-48d6-a9ff-a0f182974300')
        setAccesos(rol.accesos ?? [])
    }, [rol])
    const renderItems = (items) => {
        return items.map(item => {
            if (item.type === 'item' && item.url) {
                return (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                            <input type="checkbox" checked={
                                rol?.id === 'd10503e9-847b-48d6-a9ff-a0f182974300' ||
                                accesos.some(acc => acc.id === item.id)
                            }
                                   onChange={(e) => {
                                       const isChecked = e.target.checked;
                                       if (isChecked) setAccesos(prev => [...prev, {...item}])
                                       else setAccesos(prev => prev.filter(element => element.id !== item.id))
                                   }}/>
                        </td>
                    </tr>
                );
            }
            if (item.children) {
                return (
                    <Fragment key={item.id}>
                        <tr>
                            <td colSpan="1" style={{fontWeight: 'bold'}}>{item.title}</td>
                        </tr>
                        <tr>
                            <td colSpan="1">
                                <table>
                                    <tbody>{renderItems(item.children)}</tbody>
                                </table>
                            </td>
                        </tr>
                    </Fragment>
                );
            }
            return null;
        });
    };
    const renderGroup = (group) => {
        return (
            <div key={group.id} style={{margin: '10px', flex: 1}}>
                <h2>{group.title}</h2>
                <table>
                    <tbody>
                    {group.children && renderItems(group.children)}
                    </tbody>
                </table>
            </div>
        );
    };

    useEffect(() => {
        if (menu) {
            if(rol && rol.id === 'd10503e9-847b-48d6-a9ff-a0f182974300') setData(menu.items)
            else setData(menu.items.filter(element=>element.id!=='admin'))
        }
    }, [menu, rol])
    const guardar = async () => {
        const nombreTrim = (nombre ?? '').trim()
        if (!nombreTrim) {
            Toast.Warning('El nombre del rol es requerido')
            return
        }
        try {
            const {data: rolesData} = await Rol.getRoles('id, nombre')
            const list = rolesData?.listRol ?? []
            const target = normalizeRoleName(nombreTrim)
            const duplicated = list.find((item) => item.id !== rol?.id && normalizeRoleName(item.nombre) === target)
            if (duplicated) {
                Toast.Warning('Ya existe un rol con ese nombre')
                return
            }
        } catch (e) {
            Toast.Warning('No se pudo validar nombre de rol')
            return
        }

        Toast.Waiting('Guardando...')
        let object = {nombre: nombreTrim, descripcion, accesos, es_repartidor: esRepartidor}
        if(rol.id) object={...object, id: rol.id}
        try {
            const {data} = await Rol.createOrUpdateRol(object)
            const newRol= data.createOrUpdateRol
            if(rol.id){
                setRoles(prev => prev.map(element => element.id === newRol.id ? {...newRol} : {...element}))
                Toast.Remove()
                Toast.Success('Guardado exitoso')
                setConfig({...config, isOpen: false})
                return
            }
            setRoles(prev => [{...newRol}, ...prev])
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            setConfig({...config, isOpen: false})

        }catch (e) {
            Toast.Remove()
            Toast.Error(e.message)
        }
    }
    return (
        <Dialog open={config.isOpen} fullWidth
                maxWidth="md">
            <DialogTitle>
                {rol?.id ? 'Editar Rol' : 'Nuevo Rol'}
            </DialogTitle>
            <DialogContent>
                <br/>
                <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                    {inputNombre}
                    {inputDescripcion}
                    <FormControlLabel
                        control={switchRepartidor}
                        label="Rol Repartidor"
                        labelPlacement="start"
                    />
                </Stack>
                <Stack>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        pointerEvents: disabled ? 'none' : 'auto'
                    }}>
                        {data.map(group => renderGroup(group))}
                    </div>
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
export default ModalRoles
