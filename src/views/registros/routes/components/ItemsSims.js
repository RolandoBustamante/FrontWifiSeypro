import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {Icon} from "@iconify/react";
import {IconButton, TableCell, TableRow} from "@mui/material";
import useAsyncSelect from "../../../../customHooks/useAsyncSelect";
import Sims from "../../../../Models/Sims";
import {esUUID} from "../../../../utils/utils";
import Label from '../../../../components/label/Label';
import moment from "moment/moment";

const ItemsSims = ({sim, setViews, views, detalle, setDetalle}) => {
    ItemsSims.propTypes = {
        sim: PropTypes.object.isRequired,
        setViews: PropTypes.func.isRequired,
        views: PropTypes.array.isRequired,
        detalle: PropTypes.array.isRequired,
        setDetalle: PropTypes.func.isRequired,
    }
    const colorState = {
        ACTIVO: 'success',
        BLOQUEADO: 'error',
        INACTIVO: 'error',
    };
    const [estado, setEstado] = useState('')
    const [detail, setDetail] = useState('')
    const [chip, selectChip, setChip, , setOptionsChip] = useAsyncSelect({
        placeholder: 'Sim-Card', modelo: {Model: Sims, respuesta: 'listChipsSinUtilizar', getByParam: 'getChipParam'},
        disabled: sim&&sim.old
    })
    const [chipData, setDataChip] = useState({})

    useEffect(() => {
        if (sim && sim.id && esUUID(sim.id)) {
            setOptionsChip([{label: sim.sim_card, value: sim.id}])
            setChip(sim.id)
        }
    }, [sim])


    const eliminar = () => {
        setEstado('INACTIVO')
    }
    useEffect(() => {
        if (chip && esUUID(chip)) {
            Sims.getChipId(chip).then(response => {
                setDataChip(response.data.getChipId)
            })
        }
    }, [chip])
    useEffect(() => {
        setViews(prevState => prevState.map(element => {
            if (element.id !== sim.id) return element;

            const newElement = {
                ...sim,
                chip,
                invalid: chip === '',
                usado: estado === 'ACTIVO',
                activo: chipData.activo,
                sim_card: chipData.sim_card
            };
            return JSON.stringify(element) !== JSON.stringify(newElement) ? newElement : element;
        }));
    }, [chip, estado, sim, chipData.activo])
    useEffect(() => {
        if (chipData && chipData.paquete && chipData.fecha_renovacion) {
            if (!chipData.activo) {
                setEstado('BLOQUEADO')
                return
            }
            if (!chipData.usado && !sim.old) {
                setEstado('ACTIVO')
                return
            }
            if (chipData.usado) {
                setEstado('ACTIVO')
                return
            }
            setEstado('INACTIVO')
        }
    }, [chipData])

    useEffect(() => {
        if (chipData && chipData.paquete && chipData.fecha_renovacion && chipData.marca) {
            let {fecha_renovacion, paquete, marca} = chipData
            const diaActual = moment().format('DD')
            fecha_renovacion = moment(fecha_renovacion, 'YYYY-MM-DD').format('DD')
            if (Number(diaActual) <= Number(fecha_renovacion)) fecha_renovacion = `${moment().format("YYYY-MM")}-${fecha_renovacion}`
            else fecha_renovacion = `${moment().add(1, 'month').format("YYYY-MM")}-${fecha_renovacion}`
            setDetail(`${marca}-${paquete}(${fecha_renovacion})`)
            return
        }
        setDetail('')
    }, [chipData])


    return (
        <TableRow>
            <TableCell className="align-top" style={{margin: 0, padding: 0, textAlign: 'center'}}>
                {selectChip}
            </TableCell>
            <TableCell className="align-top" style={{margin: 0, padding: 0, textAlign: 'center'}}>
                <Label variant="soft" color={colorState[estado.toUpperCase()]} sx={{textTransform: 'capitalize'}}>
                    {estado}
                </Label>
            </TableCell>
            <TableCell className="align-top" style={{margin: 0, padding: 0, textAlign: 'center'}}>
                <div>{detail}</div>
            </TableCell>
            <TableCell className="align-top" style={{margin: 0, padding: 0, textAlign: 'center'}}>
                {sim.old && estado === 'ACTIVO' && <IconButton title="Desactivar sim-card" color="error"
                                                               onClick={() => eliminar()}>
                    <Icon icon='mdi:block'/>
                </IconButton>}
            </TableCell>
        </TableRow>
    )
}
export default ItemsSims
