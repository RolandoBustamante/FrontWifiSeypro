import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    Select,
    Typography,
    FormControlLabel, Switch
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
    const [tipoDoc, selectTipoDoc,setTipoDoc] = useSelect({
        placeholder: 'Comrpobante', optionsState: opcionesTipoDoc
    });
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
    const [mostrarTotales, setMostrarTotales] = useState(false);


    useEffect(() => {
        setOptionSedes([])
        Usuario.allSedes().then(response => {
            const {allSedes} = response.data
            const options = [{label: 'Todas', value: ''}]
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
            const elementos = [{label: 'Todos', value: ''}]
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
        setMostrarTotales(false)
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
                    {selectTipoDoc}
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
                <Grid item xs={12} sm={6} md={3}>
                    {(resumen?.anulado?.cantidad > 0 || resumen?.anulado?.total > 0) && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={mostrarTotales}
                                    onChange={() => setMostrarTotales(prev => !prev)}
                                />
                            }
                            label="Mostrar Totales (Incluye Anulados)"
                            sx={{ mt: 1 }}
                        />
                    )}
                </Grid>
            </Grid>

            {resumen && (
                <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="subtitle1"><strong>Resumen de Caja</strong></Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2"><strong>Activos</strong></Typography>
                            <Typography variant="body2">Total: S/ {resumen.activo.total.toFixed(2)}</Typography>
                            <Typography variant="body2">Comprobantes: {resumen.activo.cantidad}</Typography>
                        </Grid>

                        {(resumen?.anulado?.cantidad > 0 || resumen?.anulado?.total > 0) && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2"><strong>Anulados</strong></Typography>
                                <Typography variant="body2">Total: S/ {resumen.anulado.total.toFixed(2)}</Typography>
                                <Typography variant="body2">Comprobantes: {resumen.anulado.cantidad}</Typography>
                            </Grid>
                        )}

                        {mostrarTotales && (
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>Totales Generales</strong></Typography>
                                <Typography variant="body2">Total: S/ {resumen.total.total.toFixed(2)}</Typography>
                                <Typography variant="body2">Comprobantes: {resumen.total.cantidad}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            )}
        </Paper>
    );
}
