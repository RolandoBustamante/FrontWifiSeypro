import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
  Box,
  TextField,
  Stack
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Icon} from '@iconify/react';
import CustomTable from '../utilsComponents/CustomTable';
import Label from './label';

const PendientesCobroDialog = ({open, onClose, items}) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [buscar, setBuscar] = useState('');
  const [openRows, setOpenRows] = useState(() => new Set());

  const filteredItems = useMemo(() => {
    const term = buscar.trim().toLowerCase();
    if (!term) return items;
    return items.filter((row) => {
      const nombre = row.cliente?.nombres || '';
      const doc = row.cliente?.documento || '';
      const celulares = Array.isArray(row.cliente?.celulares) ? row.cliente.celulares : [];
      const celularesText = celulares.map((c) => `${c.tipo || ''} ${c.numero || ''}`).join(' ').toLowerCase();
      const movimientos = Array.isArray(row.movimientos) ? row.movimientos : [];
      const movimientosText = movimientos.map((m) => `${m.router?.imei || ''} ${m.router?.sim || ''} ${m.sede || ''} ${m.periodo || ''}`).join(' ').toLowerCase();
      const sede = movimientos[0]?.sede || '';
      return (
        nombre.toLowerCase().includes(term) ||
        doc.toLowerCase().includes(term) ||
        celularesText.includes(term) ||
        movimientosText.includes(term) ||
        sede.toLowerCase().includes(term)
      );
    });
  }, [items, buscar]);

  const handleToggleRow = (row) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      const rowId = row.cliente?.id || row.cliente_id;
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const tableItems = useMemo(() => {
    return filteredItems.map((row) => {
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
                <Typography variant="body2" color="text.secondary">
                  Sin celulares registrados
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )
      };
    });
  }, [filteredItems, openRows]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isSmDown}
    >
      <DialogTitle sx={{position: 'relative', pr: 6}}>
        <Typography variant="h6">Pendientes de cobro</Typography>
        <IconButton
          onClick={onClose}
          sx={{position: 'absolute', right: 8, top: 8}}
        >
          <Icon icon="mdi:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{pt: 1}}>
        <Stack spacing={2} sx={{mb: 2}}>
          <Typography variant="body2" color="text.secondary">
            Hola, hay clientes con cobros retrasados. Revisa el detalle y comunícate con ellos.
          </Typography>
          <Box sx={{maxWidth: 320}}>
            <TextField
              size="small"
              fullWidth
              placeholder="Buscar"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
          </Box>
        </Stack>
        <CustomTable
          data={tableItems}
          loading={false}
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
      </DialogContent>
    </Dialog>
  );
};

PendientesCobroDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object)
};

PendientesCobroDialog.defaultProps = {
  items: []
};

export default PendientesCobroDialog;
