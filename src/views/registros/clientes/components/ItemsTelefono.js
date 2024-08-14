import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Checkbox, IconButton, MenuItem, Select, TableCell, TableRow} from "@mui/material";
import {Icon} from "@iconify/react";
import useInput from "../../../../customHooks/useInput";
import useSelect from "../../../../customHooks/useSelect";
import {esUUID} from "../../../../utils/utils";

const options = [{label: 'Whatsapp', value: 'Whatsapp'}, {label: 'Llamadas', value: 'Llamadas'},
    {label: 'Principal', value: 'Principal'}, {label: 'Secundario', value: 'Secundario'}, {
        label: 'Otro',
        value: 'Otro'
    }]
const ItemsTelefono = ({telefono, setViews, views, detalle, setDetalle, first}) => {
    ItemsTelefono.propTypes = {
        telefono: PropTypes.object.isRequired,
        setViews: PropTypes.func.isRequired,
        views: PropTypes.array.isRequired,
        detalle: PropTypes.array.isRequired,
        setDetalle: PropTypes.func.isRequired,
        first: PropTypes.bool
    }
    const [loaded, setLoaded] = useState(false)

    const [numero, inputNumero, setNumero, setInvalidNumero, setMsgNumero] = useInput({
        typeState: 'number'
    })
    const [tipo, selectTipo, setTipo, setInvalidTipo] = useSelect({
        optionsState: options, initialState: 'Principal'
    })
    useEffect(()=>{
        if(telefono && !loaded){
            setLoaded(true)
            setNumero(telefono.numero??'')
            setTipo(telefono.tipo?? 'Principal')
        }
    },[telefono, loaded])
    const eliminar = () => {
        setViews(views.filter((element) => element.id !== telefono.id))
        setDetalle(detalle.filter((element) => element !== telefono.id))
    }
    useEffect(() => {
        const invalidNumero = numero === ''
        const invalidTipo = tipo === ''
        setInvalidNumero(invalidNumero)
        setInvalidTipo(invalidTipo)
        setMsgNumero('  ')
        setViews(prevState => prevState.map(element => {
            return element.id !== telefono.id ? element : {
                id: telefono.id, tipo, numero,
                invalid: invalidTipo || invalidNumero
            }
        }))
    }, [numero, tipo, telefono])
    return (
        <TableRow>
            <TableCell className="align-top"
                       style={{width: '30%', margin: 0, padding: 5}}>{selectTipo}</TableCell>
            <TableCell className="align-top" style={{width: '50%', margin: 0, padding: 5}}>{inputNumero}</TableCell>
            <TableCell className="align-top" align="center" style={{margin: 0, padding: 0}}>
                {(!first || esUUID(telefono.id))&&<IconButton title="eliminar" color="error"
                                       onClick={() => eliminar()}>
                    <Icon icon='mdi:delete'/>
                </IconButton>}
            </TableCell>
        </TableRow>
    )
}
export default ItemsTelefono
