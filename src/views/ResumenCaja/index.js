import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import Toast from '../../utils/toastUtil';
import Ventas from '../../Models/Ventas';
import moment from 'moment';
import useInput from "../../customHooks/useInput";
import Usuario from "../../Models/Usuario";
import useSelect from "../../customHooks/useSelect";
import TipoVenta from "../../Models/TipoVenta";

const opcionesTipoDoc = [
    { value: '', label: 'Todos' },
    { value: '01', label: 'Factura' },
    { value: '03', label: 'Boleta' },
    { value: '04', label: 'Nota de Venta' }
];

export default function ResumenCaja() {
    const [tipoDoc, setTipoDoc] = useState('');
    const [desde, inputDesde] = useInput({
        typeState: 'date',
        initialState: moment().startOf('isoWeek').format('YYYY-MM-DD'), // lunes
        placeholder: 'Desde'
    });

    const [hasta, inputHasta] = useInput({
        typeState: 'date',
        initialState: moment().endOf('isoWeek').format('YYYY-MM-DD'), // domingo
        placeholder: 'Hasta'
    });
    const [sedeId, selectSede, , , setOptionSedes, ,] = useSelect({
        placeholder: 'Sede'
    })
    const [tipoId, selectTipoPago, , , setOptionsTipo] = useSelect({
        placeholder: 'Metodo de pago'
    })
    const [ventasTipo, setTipoVentas] = useState([])

    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOptionSedes([])
        Usuario.allSedes().then(response => {
            const {allSedes} = response.data
            const options = []
            for (const element of allSedes) {
                options.push({value: element.id, label: element.nombre})
            }
            setOptionSedes(options)
        })
    }, [])
    useEffect(() => {
        TipoVenta.getListTipoBancos()
            .then(response => {
                const {listTipoPago} = response.data
                setTipoVentas(listTipoPago)
            })
    }, [])
    useEffect(() => {
        if (ventasTipo) {
            const elementos = []
            for (const element of ventasTipo) {
                elementos.push({label: element.nombre, value: element.id})
            }
            setOptionsTipo(elementos)
        }
    }, [ventasTipo])
    const obtenerResumen = async () => {
        Toast.Remove();
        if (!desde || !hasta) {
            Toast.Warning('Debes seleccionar ambas fechas');
            return;
        }

        setLoading(true);
        try {
            const response = await Ventas.getResumenCaja({
                desde,
                hasta,
                tipoDoc: tipoDoc || null,
                tipoId: tipoId || null,
                sedeId: sedeId || null,
            });

            const data = response?.data?.resumenCaja.data;
            if (data) {
                setResumen(data);
                Toast.Success('Resumen obtenido correctamente');
            } else {
                setResumen(null);
                Toast.Warning('No hay resultados en ese rango');
            }
        } catch (error) {
            console.error(error);
            Toast.Error('Error al obtener el resumen');
        }
        setLoading(false);
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    {inputDesde}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {inputHasta}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {selectTipoPago}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {selectSede}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Select
                        fullWidth
                        value={tipoDoc}
                        onChange={e => setTipoDoc(e.target.value)}
                        displayEmpty
                    >
                        {opcionesTipoDoc.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        onClick={obtenerResumen}
                        disabled={loading}
                        startIcon={<Icon icon="mdi:calculator" />}
                        fullWidth
                    >
                        {loading ? <CircularProgress size={20} /> : 'Consultar'}
                    </Button>
                </Grid>
            </Grid>

            {resumen && (
                <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="subtitle1"><strong>Resumen</strong></Typography>
                    <Typography variant="body2">Total: S/ {resumen.total.toFixed(2)}</Typography>
                    <Typography variant="body2">Comprobantes Emitidos: {resumen.cantidad}</Typography>
                </Paper>
            )}
        </Paper>
    );
}
