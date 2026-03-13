import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Chart from 'react-apexcharts';
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Label from 'components/label';
import Toast from 'utils/toastUtil';
import DashboardModel from '../../../Models/Dashboard';
import { useAuthContext } from '../../../auth/useAuthContext';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(Number(value ?? 0));

const formatNumber = (value) => new Intl.NumberFormat('es-PE').format(Number(value ?? 0));

const formatText = (value) => {
  if (!value) return '-';
  return String(value)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const summaryCardStyles = [
  { color: '#0F766E', bg: '#CCFBF1', icon: <PointOfSaleOutlinedIcon fontSize="small" /> },
  { color: '#1D4ED8', bg: '#DBEAFE', icon: <PeopleAltOutlinedIcon fontSize="small" /> },
  { color: '#B45309', bg: '#FEF3C7', icon: <CreditCardOffOutlinedIcon fontSize="small" /> },
  { color: '#7C3AED', bg: '#EDE9FE', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
  { color: '#BE123C', bg: '#FFE4E6', icon: <RouterOutlinedIcon fontSize="small" /> },
  { color: '#1F2937', bg: '#E5E7EB', icon: <AssignmentReturnOutlinedIcon fontSize="small" /> }
];

const activityColor = {
  VENTA: 'success',
  ASIGNACION_REPARTIDOR: 'info',
  REASIGNACION_REPARTIDOR: 'warning',
  ENTREGA_CLIENTE: 'primary',
  DEVOLUCION_SEDE: 'secondary',
  TRASLADO_SEDE: 'default'
};

const SummaryCard = ({ title, value, subtitle, tone }) => (
  <MainCard border={false} sx={{ height: '100%' }}>
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.75 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tone.color,
            backgroundColor: tone.bg
          }}
        >
          {tone.icon}
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Stack>
  </MainCard>
);

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  tone: PropTypes.shape({
    color: PropTypes.string.isRequired,
    bg: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired
  }).isRequired
};

const Dashboard = () => {
  const theme = useTheme();
  const { sesion, selectSede } = useAuthContext();
  const [periodo, setPeriodo] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const onChangeSede = async (sedeId) => {
    if (!sedeId || sedeId === sesion?.sede_seleccionada) return;
    try {
      setLoading(true);
      await selectSede(sedeId);
    } catch (error) {
      Toast.Error(error?.graphQLErrors?.[0]?.message || error.message);
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await DashboardModel.dashboardResumen(periodo);
      setDashboard(response?.data?.dashboardResumen?.data ?? null);
    } catch (error) {
      Toast.Error(error?.graphQLErrors?.[0]?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [periodo, sesion?.sede_seleccionada]);

  const resumen = dashboard?.resumen ?? {};
  const estadosRouters = dashboard?.estadosRouters ?? [];
  const actividadReciente = dashboard?.actividadReciente ?? [];
  const ventasMensuales = dashboard?.series?.ventasMensuales ?? [];
  const altasMensuales = dashboard?.series?.altasMensuales ?? [];
  const cobranzasMensuales = dashboard?.series?.cobranzasMensuales ?? [];

  const cards = useMemo(
    () => [
      {
        title: 'Facturacion del mes',
        value: formatCurrency(resumen.facturacionMes),
        subtitle: `${formatNumber(resumen.altasMes)} nuevos servicios del mes`,
        tone: summaryCardStyles[0]
      },
      {
        title: 'Clientes activos',
        value: formatNumber(resumen.clientesActivos),
        subtitle: `${formatNumber(resumen.serviciosActivos)} servicios activos`,
        tone: summaryCardStyles[1]
      },
      {
        title: 'Deuda vencida',
        value: formatCurrency(resumen.montoDeudaVencida),
        subtitle: `${formatNumber(resumen.deudasVencidas)} cuotas vencidas | abierta ${formatCurrency(resumen.montoDeudaPendiente)}`,
        tone: summaryCardStyles[2]
      },
      {
        title: 'Routers en envio',
        value: formatNumber(resumen.routersEnEnvio),
        subtitle: `${formatNumber(resumen.asignacionesActivas)} routers a cargo de repartidores`,
        tone: summaryCardStyles[3]
      },
      {
        title: 'Routers por asignar',
        value: formatNumber(resumen.routersPorAsignar),
        subtitle: `${formatNumber(resumen.routersLibres)} routers libres`,
        tone: summaryCardStyles[4]
      },
      {
        title: 'Recojos activos',
        value: formatNumber(resumen.recojosActivos),
        subtitle: `${formatNumber(resumen.clientesConDeudaVencida)} clientes con deuda vencida`,
        tone: summaryCardStyles[5]
      }
    ],
    [resumen]
  );

  const ventasChart = useMemo(
    () => ({
      series: [
        {
          name: 'Ventas',
          data: ventasMensuales.map((item) => Number(item.value ?? 0))
        },
        {
          name: 'Cobranzas',
          data: cobranzasMensuales.map((item) => Number(item.value ?? 0))
        }
      ],
      options: {
        chart: { type: 'bar', toolbar: { show: false }, fontFamily: theme.typography.fontFamily },
        colors: [theme.palette.primary.main, theme.palette.success.main],
        plotOptions: { bar: { borderRadius: 6, columnWidth: '48%' } },
        dataLabels: { enabled: false },
        stroke: { show: false },
        xaxis: {
          categories: ventasMensuales.map((item) => item.label),
          labels: { rotate: -25 }
        },
        yaxis: {
          labels: {
            formatter: (value) => `S/ ${formatNumber(value)}`
          }
        },
        tooltip: {
          y: {
            formatter: (value) => formatCurrency(value)
          }
        },
        legend: { position: 'top', horizontalAlign: 'left' },
        grid: { borderColor: theme.palette.divider }
      }
    }),
    [ventasMensuales, cobranzasMensuales, theme]
  );

  const altasChart = useMemo(
    () => ({
      series: [
        {
          name: 'Nuevos servicios',
          data: altasMensuales.map((item) => Number(item.value ?? 0))
        }
      ],
      options: {
        chart: { type: 'area', toolbar: { show: false }, fontFamily: theme.typography.fontFamily },
        colors: ['#C2410C'],
        stroke: { curve: 'smooth', width: 3 },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.35,
            opacityTo: 0.05,
            stops: [0, 100]
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: altasMensuales.map((item) => item.label),
          labels: { rotate: -25 }
        },
        yaxis: {
          labels: { formatter: (value) => formatNumber(value) }
        },
        tooltip: {
          y: {
            formatter: (value) => `${formatNumber(value)} nuevos servicios`
          }
        },
        grid: { borderColor: theme.palette.divider }
      }
    }),
    [altasMensuales, theme]
  );

  const estadosChart = useMemo(
    () => ({
      series: estadosRouters.map((item) => Number(item.value ?? 0)),
      options: {
        chart: { type: 'donut', fontFamily: theme.typography.fontFamily },
        labels: estadosRouters.map((item) => item.label),
        colors: ['#0EA5E9', '#8B5CF6', '#F97316', '#14B8A6', '#64748B', '#DC2626'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: true },
        tooltip: {
          y: {
            formatter: (value) => `${formatNumber(value)} routers`
          }
        },
        stroke: { colors: [theme.palette.background.paper] }
      }
    }),
    [estadosRouters, theme]
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(1.5px)',
            borderRadius: 2
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={gridSpacing} sx={{ opacity: loading ? 0.55 : 1, transition: 'opacity 0.2s ease' }}>
        <Grid item xs={12}>
          <MainCard border={false}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h2">Dashboard operativo</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Ventas, cobranzas, deuda, altas y movimiento real de routers por sede.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label="Sede"
                  size="small"
                  value={sesion?.sede_seleccionada || ''}
                  onChange={(event) => onChangeSede(event.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: 220 }}
                >
                  {(sesion?.sedes || []).map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Periodo"
                  type="month"
                  size="small"
                  value={periodo}
                  onChange={(event) => setPeriodo(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        {cards.map((card) => (
          <Grid item xs={12} sm={6} lg={4} xl={2} key={card.title}>
            <SummaryCard {...card} />
          </Grid>
        ))}

        <Grid item xs={12} lg={8}>
          <MainCard border={false}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4">Ventas y cobranzas</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ultimos 6 meses en base a operaciones emitidas y movimientos pagados.
                </Typography>
              </Box>
              <Chart options={ventasChart.options} series={ventasChart.series} type="bar" height={330} />
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <MainCard border={false}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4">Estados de routers</Typography>
                <Typography variant="body2" color="text.secondary">
                  Distribucion actual del inventario operativo. No depende del periodo seleccionado.
                </Typography>
              </Box>
              <Chart options={estadosChart.options} series={estadosChart.series} type="donut" height={330} />
              <Stack spacing={1}>
                {estadosRouters.map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Label color="default">{formatNumber(item.value)}</Label>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12} lg={7}>
          <MainCard border={false}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4">Nuevos servicios</Typography>
                <Typography variant="body2" color="text.secondary">
                  Servicios nuevos registrados en los ultimos 6 meses.
                </Typography>
              </Box>
              <Chart options={altasChart.options} series={altasChart.series} type="area" height={320} />
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <MainCard border={false}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4">Indicadores operativos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lectura rapida del estado comercial y logistico.
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Clientes nuevos del mes</Typography>
                  <Label color="info">{formatNumber(resumen.clientesNuevosMes)}</Label>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Clientes con deuda vencida</Typography>
                  <Label color="warning">{formatNumber(resumen.clientesConDeudaVencida)}</Label>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Clientes con deuda abierta</Typography>
                  <Label color="info">{formatNumber(resumen.clientesConDeuda)}</Label>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Routers usados</Typography>
                  <Label color="success">{formatNumber(resumen.routersUsados)}</Label>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Routers devueltos</Typography>
                  <Label color="default">{formatNumber(resumen.routersDevueltos)}</Label>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Routers no devueltos</Typography>
                  <Label color="error">{formatNumber(resumen.routersNoDevueltos)}</Label>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Routers a cargo de repartidores</Typography>
                  <Label color="secondary">{formatNumber(resumen.asignacionesActivas)}</Label>
                </Stack>
              </Stack>
              <Divider />
              <Box>
                <Typography variant="subtitle1">Sede actual</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {dashboard?.sedeId ? 'Dashboard filtrado por la sede seleccionada del usuario.' : 'Dashboard global sin filtro de sede.'}
                </Typography>
              </Box>
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard border={false}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h4">Actividad reciente</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ultimos movimientos comerciales y logisticos registrados.
                </Typography>
              </Box>
              <List disablePadding>
                {actividadReciente.length === 0 && (
                  <ListItem disableGutters>
                    <ListItemText primary="No hay actividad reciente para este periodo." />
                  </ListItem>
                )}
                {actividadReciente.map((item, index) => (
                  <React.Fragment key={`${item.tipo}-${item.titulo}-${index}`}>
                    <ListItem disableGutters sx={{ py: 1.25 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <Stack spacing={0.75}>
                            <Label color={activityColor[item.tipo] || 'default'}>{formatText(item.tipo)}</Label>
                            <Typography variant="caption" color="text.secondary">
                              {moment(item.fecha).format('YYYY-MM-DD HH:mm')}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle1">{item.titulo || '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="text.secondary">
                            {formatText(item.descripcion)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2" textAlign={{ xs: 'left', md: 'right' }}>
                            {item.monto !== null && item.monto !== undefined ? formatCurrency(item.monto) : '-'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    {index < actividadReciente.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

