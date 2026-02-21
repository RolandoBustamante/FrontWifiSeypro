import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Button, Container, Grid, IconButton, Typography} from '@mui/material';
import Toast from '../../utils/toastUtil';
import useInput from '../../customHooks/useInput';
import CustomTable from '../../utilsComponents/CustomTable';
import Ventas from '../../Models/Ventas';
import Label from '../../components/label';
import {Icon} from '@iconify/react';

const MovimientosPendientes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openRows, setOpenRows] = useState(() => new Set());
  const [buscar, inputBuscar] = useInput({
    typeState: 'text',
    initialState: '',
    placeholder: 'Buscar'
  });
  const fetchData = async () => {
    Toast.Remove();
    setLoading(true);
    try {
      const res = await Ventas.listarMovimientosPendientes(buscar.trim());
      const detallesJson = res?.data?.listarMovimientosPendientes?.detallesJson;
      const parsed = typeof detallesJson === 'string' ? JSON.parse(detallesJson) : detallesJson;
      setData(parsed?.items || []);
    } catch (e) {
      Toast.Error('Error al obtener movimientos pendientes');
    }
    setLoading(false);
  };

  const handleToggleRow = (row) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      const rowId = row.cliente?.id || row.cliente_id;
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };
  const tableItems = data.map((row) => {
    const celulares = Array.isArray(row.cliente?.celulares) ? row.cliente.celulares : [];
    const movimientos = Array.isArray(row.movimientos) ? row.movimientos : [];
    const rowId = row.cliente?.id || row.cliente_id;
    return {
      ...row,
      open: openRows.has(rowId),
      collapseElement: (
        <Box sx={{p: 1}}>
          <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '2fr 1fr'}, gap: 2}}>
            <Box>
              <Typography variant="subtitle2" sx={{mb: 1}}>
                Detalle de movimientos
              </Typography>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(90px, 120px) minmax(90px, 120px) minmax(90px, 140px) minmax(90px, 140px)',
                    gap: 1,
                    alignItems: 'center',
                    px: 1,
                    py: 0.75,
                    bgcolor: 'background.neutral',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
                    Periodo
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
                    Monto
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
                    Retraso
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
                    F. Cobro
                  </Typography>
                </Box>
                {movimientos.map((m, idx) => (
                  <Box
                    key={`${rowId}-mov-${idx}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(90px, 120px) minmax(90px, 120px) minmax(90px, 140px) minmax(90px, 140px)',
                      gap: 1,
                      alignItems: 'center',
                      px: 1,
                      py: 0.75,
                      borderTop: idx === 0 ? 'none' : '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2">{m.periodo || '-'}</Typography>
                    <Typography variant="body2">{`S/ ${Number(m.monto || 0).toFixed(2)}`}</Typography>
                    {m.dias !== undefined && m.dias !== null ? (
                      <Label variant="soft" color="error" sx={{textTransform: 'capitalize', width: 'fit-content'}}>
                        {`${m.dias} días de retraso`}
                      </Label>
                    ) : (
                      <Typography variant="body2">-</Typography>
                    )}
                    <Typography variant="body2">{m.fecha_cobro || '-'}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{mb: 1}}>
                Números de contacto
              </Typography>
              {celulares.length > 0 ? (
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(120px, 180px) 1fr',
                      gap: 1,
                      alignItems: 'center',
                      px: 1,
                      py: 0.75,
                      bgcolor: 'background.neutral',
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
                      Tipo
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>
                      Número
                    </Typography>
                  </Box>
                  {celulares.map((c, idx) => (
                    <Box
                      key={`${rowId}-cel-${idx}`}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(120px, 180px) 1fr',
                        gap: 1,
                        alignItems: 'center',
                        px: 1,
                        py: 0.75,
                        borderTop: idx === 0 ? 'none' : '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {c.tipo || 'Celular'}
                      </Typography>
                      <Label variant="soft" color="success" sx={{textTransform: 'none', width: 'fit-content'}}>
                        <a href={`tel:${c.numero}`} style={{color: 'inherit', textDecoration: 'none'}}>
                          {c.numero || '-'}
                        </a>
                      </Label>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Label variant="soft" color="warning" sx={{textTransform: 'capitalize', margin: 1}}>
                  Sin celulares registrados
                </Label>
              )}
            </Box>
          </Box>
        </Box>
      )
    };
  });

  useEffect(() => {
    fetchData().then(r => r);
  }, []);

  return (
    <Container maxWidth={false} disableGutters sx={{px: {xs: 2, sm: 3}, maxWidth: '100%'}}>
      <Card sx={{overflow: 'hidden'}}>
        <CardContent sx={{overflow: 'hidden'}}>
          <Grid container spacing={2} alignItems="center" sx={{minWidth: 0}}>
            <Grid item xs={12} sm={6} md={4}>
              {inputBuscar}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex">
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  onClick={fetchData}
                >
                  Buscar
                </Button>
              </Box>
            </Grid>
          </Grid>
          <br />
          <div style={{width: '100%', height: '100%'}}>
            <CustomTable
              data={tableItems}
              loading={loading}
              pagination={false}
              columns={[
                {
                  header: '',
                  Cell: (row) => (
                    <IconButton size="small" onClick={() => handleToggleRow(row)}>
                      <Icon icon={openRows.has(row.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                    </IconButton>
                  ),
                  align: 'center',
                  cellStyle: {minWidth: '36px'}
                },
                {
                  header: 'Cliente',
                  Cell: (row) => row.cliente?.nombres || '-',
                  cellStyle: {minWidth: '260px'},
                  align: 'left'
                },
                {
                  header: 'Sede',
                  Cell: (row) => row.movimientos?.[0]?.sede || '-',
                  align: 'left'
                },
                {
                  header: 'Total deuda',
                  align: 'center',
                  cellStyle: {minWidth: '70px'},
                  Cell: (row) => `S/ ${Number(row.total_deuda || 0).toFixed(2)}`
                }
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MovimientosPendientes;
