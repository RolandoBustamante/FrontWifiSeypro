import Ventas from '../../Models/Ventas';
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import moment from 'moment';
import { Icon } from '@iconify/react';

import CustomTable from '../../utilsComponents/CustomTable';
import DialogPdfViewer from '../../components/DialogPdfViewer';
import Toast from '../../utils/toastUtil';
import Swal from 'sweetalert2';
import Label from '../../components/label';
import DocumentViewer from '../../components/DocumentosViewer';
import useInput from '../../customHooks/useInput';
import useMountedRef from '../../customHooks/useMountedRef';

const ListVentas = () => {
  const mountedRef = useMountedRef();
  const colorState = {
    ACEPTADO: 'success',
    ANULADO: 'error'
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [data, setData] = useState([]);
  const [configView, setConfigView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(null);
  const [limit, setLimit] = useState(10);
  const [infoData, setInfoData] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [time, setTime] = useState(0);
  const [buscar, inputBuscar] = useInput({
    typeState: 'text',
    initialState: '',
    placeholder: 'Buscar...'
  });

  useEffect(() => {
    if (!time) return undefined;
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setTime(0);
      }
    }, time * 1000);
    return () => clearTimeout(timer);
  }, [time, mountedRef]);

  useEffect(() => {
    setTime(2);
    setPage(0);
  }, [buscar]);

  const handleIconClick = (row) => {
    const document = [{ nombre: `Número Operación: ${row.nro_operacion}`, url: row.operacion_url }];
    setDocumentos(document);
    setConfigView(true);
  };

  useEffect(() => {
    if (time > 0) return undefined;
    let cancelled = false;
    setLoading(true);

    Ventas.operacionesSimplificadas(page, limit, buscar)
      .then((res) => {
        if (cancelled || !mountedRef.current) return;
        setData(res.data.listOperaciones.data.operaciones);
        setInfoData(res.data.listOperaciones.data.info);
      })
      .finally(() => {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [limit, page, time, buscar, mountedRef]);

  const rowCollapse = (row) => (
    <div style={{ padding: 10 }}>
      <ul style={{ padding: 0, margin: 0 }}>
        {row.detallesJson.map((item, idx) => (
          <li key={idx}>
            {item.descripcion} - {item.cantidad} x S/ {item.mtoPrecioUnitario.toFixed(2)} = S/ {item.mtoValorVenta.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Card>
      <CardContent style={{ padding: 0, margin: 0 }}>
        <Box display="flex" justifyContent="flex-start" width="100%" marginTop={2}>
          <Box>{inputBuscar}</Box>
        </Box>
        <br />
        <CustomTable
          data={data}
          setLimit={setLimit}
          loading={loading}
          setPage={setPage}
          setPAge={setPage}
          info={infoData}
          pagination
          columns={[
            {
              header: '',
              Cell: (row) => (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setData((prevState) =>
                      prevState.map((element) =>
                        element.id === row.id ? { ...element, open: !row.open, collapseElement: rowCollapse(row) } : { ...element }
                      )
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation();
                      setData((prevState) =>
                        prevState.map((element) => (element.id === row.id ? { ...element, open: !row.open } : { ...element }))
                      );
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {row.open ? '👇' : '👉'}
                </span>
              ),
              align: 'center'
            },
            {
              header: 'Estado',
              Cell: (row) => (
                <Label variant="soft" color={colorState[row.estado.toUpperCase()]} sx={{ textTransform: 'capitalize' }}>
                  {row.estado}
                </Label>
              ),
              align: 'center'
            },
            {
              header: 'Acción',
              align: 'center',
              Cell: (row) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <Tooltip title="Ver PDF">
                    <IconButton
                      onClick={() => {
                        Toast.Waiting('Cargando...');
                        Ventas.obtenerRuta(row.id)
                          .then((response) => {
                            if (!mountedRef.current) return;
                            const { label } = response.data.obtenerRuta;
                            setPdfUrl(label);
                            setDialogOpen(true);
                            Toast.Remove();
                          })
                          .catch(() => {
                            Toast.Remove();
                            Toast.Error('No se pudo cargar el PDF');
                          });
                      }}
                    >
                      <Icon icon="mdi:file-pdf-box" color="red" width={24} height={24} />
                    </IconButton>
                  </Tooltip>
                  {row.estado !== 'ANULADO' && row.serie.charAt(0).toUpperCase() !== 'N' && (
                    <Tooltip title="Dar de baja">
                      <IconButton
                        onClick={async () => {
                          const { value: motivo } = await Swal.fire({
                            title: 'Motivo de la baja',
                            input: 'text',
                            inputPlaceholder: 'Ingrese el motivo',
                            showCancelButton: true,
                            confirmButtonText: 'Confirmar',
                            cancelButtonText: 'Cancelar',
                            inputValidator: (value) => {
                              if (!value) return 'Debe ingresar un motivo';
                              return null;
                            }
                          });

                          if (motivo) {
                            Toast.Waiting('Enviando a SUNAT...');
                            try {
                              const res = await Ventas.anularComprobante(row.id, motivo);
                              const { anularOperacion } = res.data;
                              Toast.Remove();
                              if (anularOperacion.success) {
                                Toast.Success('Nota de crédito emitida correctamente');
                              } else {
                                Toast.Error('Error al emitir la nota');
                              }
                              window.location.reload();
                            } catch (e) {
                              Toast.Remove();
                              Toast.Error(e.message);
                            }
                          }
                        }}
                      >
                        <Icon icon="mdi:file-cancel-outline" color="orange" width={24} height={24} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {row.estadoSunat === 'RECHAZADO' && (
                    <Tooltip title="Reenviar a SUNAT">
                      <IconButton
                        onClick={async () => {
                          Toast.Waiting('Reenviando a SUNAT...');
                          try {
                            const res = await Ventas.reenviarFacturaBoleta(row.id);
                            const { reenviarOperacion } = res.data;

                            Toast.Remove();
                            if (reenviarOperacion.success) {
                              Toast.Success('Comprobante reenviado correctamente');
                            } else {
                              Toast.Error('Error al reenviar el comprobante');
                            }

                            window.location.reload();
                          } catch (e) {
                            Toast.Remove();
                            Toast.Error(e?.graphQLErrors?.[0]?.message || e.message);
                          }
                        }}
                      >
                        <Icon icon="mdi:reload" color="#1976d2" width={24} height={24} />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )
            },
            { header: 'Cliente', accessor: 'clienteNombre' },
            { header: 'Serie', accessor: 'serie' },
            { header: 'Correlativo', accessor: 'correlativo' },
            {
              header: 'Fecha Emisión',
              accessor: 'fechaEmision',
              Cell: (row) => moment(row.fechaEmision).format('YYYY-MM-DD')
            },
            { header: 'Subtotal', accessor: 'subtotal', Cell: (row) => `S/ ${row.subtotal.toFixed(2)}` },
            { header: 'IGV', accessor: 'igv', Cell: (row) => `S/ ${row.igv.toFixed(2)}` },
            { header: 'Total', accessor: 'total', Cell: (row) => `S/ ${row.total.toFixed(2)}` },
            {
              header: 'Comp.',
              Cell: (row) => {
                const { operacion_url, nro_operacion } = row;
                return (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {operacion_url && nro_operacion && (
                      <IconButton title="Ver Comprobante" component="label" onClick={() => handleIconClick(row)} style={{ padding: 0, margin: 0 }}>
                        <Icon icon="mdi:eye" style={{ fontSize: 18, color: 'inherit' }} />
                      </IconButton>
                    )}
                  </div>
                );
              },
              cellStyle: { minWidth: '3px' },
              align: 'center'
            }
          ]}
        />
      </CardContent>
      <DocumentViewer documentos={documentos} config={configView} setConfig={setConfigView} />
      <DialogPdfViewer
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        url={pdfUrl}
      />
    </Card>
  );
};
export default ListVentas;

