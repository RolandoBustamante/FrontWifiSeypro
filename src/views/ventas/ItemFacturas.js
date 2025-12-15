import React, {useEffect} from "react"
import PropTypes from 'prop-types'
import {FormControlLabel, IconButton, TableCell, TableRow} from "@mui/material";
import useInput from "../../customHooks/useInput";
import useSwitch from "../../customHooks/useSwitch";
import {esUUID} from "../../utils/utils";
import {Icon} from "@iconify/react";
import useSelect from "../../customHooks/useSelect";


const detalleTipo=[
    {label: 'Pago',value: 'PAGO'},
    {label: 'Mora',value: 'MORA'},
    {label: 'Reconexión',value: 'RECONEXION'}
]

const ItemFacturas = ({item, setViews, views, setDetalle, detalle}) => {
    ItemFacturas.propTypes = {
        item: PropTypes.object.isRequired,
        setViews: PropTypes.func.isRequired,
        views: PropTypes.array.isRequired,
        detalle: PropTypes.array.isRequired,
        setDetalle: PropTypes.func.isRequired,
    }
    const [servicio, inputServicio, setServicio] = useInput({
        typeState: 'month', disabled: esUUID(item.id)
    })
    const [subTotal, inputSubTotal, setSubTotal] = useInput({
        typeState: 'number', disabled: true
    })
    const [igv, inputIgv, setIgv] = useInput({
        typeState: 'number', disabled: true
    })
    const [gratis, switchGratis,setSwitch] = useSwitch({initialState: false})
    const [monto, inputMonto, setMonto] = useInput({
        typeState: 'number'
    })
    const [tipo, selectTipo, setTipo]=useSelect({
        optionsState: detalleTipo, placeholder:'',isDisabled: esUUID(item.id)
    })
    useEffect(() => {
        setSubTotal((monto / 1.18).toFixed(2))
        setIgv((monto - (monto / 1.18)).toFixed(2))
    }, [monto])
    useEffect(() => {
        if (servicio === '' || subTotal === '' || igv === '' || monto === '' || tipo==='') return
        setViews(prev => prev.map(element => {
            return element.id !== item.id ? element : {
                id: item.id, servicio, subTotal, igv, gratis, monto, tipo_movimiento: tipo
            }
        }))
    }, [servicio, subTotal, igv, gratis, monto, tipo])
    useEffect(()=>{
        if(item.id){
            setServicio(item.servicio??'')
            setSwitch(item.gratis??false)
            setMonto(item.monto??'')
            setTipo(item.tipo_movimiento??'')
        }
    },[item])
    const eliminar= ()=>{
        setViews(views.filter((element) => element.id !== item.id))
        setDetalle(detalle.filter((element) => element !== item.id))
    }

    return (
        <TableRow>
            <TableCell style={{padding:0, margin:0}}>{selectTipo}</TableCell>
            <TableCell style={{padding:0, margin:0}}>{inputServicio}</TableCell>
            <TableCell style={{padding:0, margin:0}}><FormControlLabel
                control={switchGratis}
                label=""
                labelPlacement="start"
            /></TableCell>
            <TableCell style={{padding:0, margin:0}}>{inputSubTotal}</TableCell>
            <TableCell style={{padding:0, margin:0}}>{inputIgv}</TableCell>
            <TableCell style={{padding:0, margin:0}}>{inputMonto}</TableCell>
            <TableCell className="align-top" align="center" style={{margin: 0, padding: 0}}>
                <IconButton title="eliminar" color="error"
                                                                onClick={() => eliminar()}>
                    <Icon icon='mdi:delete'/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
export default ItemFacturas