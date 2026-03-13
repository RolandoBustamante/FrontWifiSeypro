import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Container } from '@mui/material';
import moment from 'moment';

import ReactTablePagination from '../../utilsComponents/CustomTable';
import Label from '../../components/label';
import useInput from '../../customHooks/useInput';

import Usuario from '../../Models/Usuario';
import Clientes from '../../Models/Clientes';
import ModalFacturarPendientes from './ModalFacturasPendientes';
import useMountedRef from '../../customHooks/useMountedRef';

const HistoricoClienteRouters = () => {
  const mountedRef = useMountedRef();
  const [data, setData] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [infoData, setInfoData] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [openFact, setOpenFact] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [buscar, inputBuscar] = useInput({
    typeState: 'text',
    initialState: '',
    placeholder: 'Buscar...'
  });

  const [time, setTime] = useState(0);

  useEffect(() => setTime(2), [buscar]);

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
    let cancelled = false;
    Usuario.allSedes().then((r) => {
      if (!cancelled && mountedRef.current) {
        setSedes(r.data.allSedes || []);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mountedRef]);

  useEffect(() => {
    if (time > 0) return undefined;
    let cancelled = false;
    setLoading(true);

    Clientes.listaClientesRoutersHistorico(page, limit, buscar)
      .then((res) => {
        if (cancelled || !mountedRef.current) return;
        const { allRouters, info } = res.data.listaClientesRoutersHistorico.data;
        setData(allRouters || []);
        setInfoData(info);
      })
      .finally(() => {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [time, page, limit, buscar, mountedRef]);

  const getSede = (id) => sedes.find((s) => s.id === id)?.nombre || '-';

  const collapseDetalle = (row) => (
    <Box p={2} border="1px solid #ddd" borderRadius={2} bgcolor="#fafafa">
      <strong>Router IMEI:</strong> {row.imei}
      <br />
      <strong>Marca:</strong> {row.marca || '-'}
      <br />
      <strong>Estado:</strong> {row.estado}
      <br />

      <Box mt={2}>
        <strong>SIMs asociadas</strong>
        <table width="100%" style={{ marginTop: 8, fontSize: 13 }}>
          <thead>
            <tr>
              <th>SIM</th>
              <th>Marca</th>
              <th>Paquete</th>
              <th>Activo</th>
              <th>Bloqueado</th>
            </tr>
          </thead>
          <tbody>
            {row.sims_json.map((sim) => (
              <tr key={sim.id}>
                <td>{sim.sim_card}</td>
                <td>{sim.marca || '-'}</td>
                <td>{sim.paquete || '-'}</td>
                <td>{sim.activo ? 'SI' : 'NO'}</td>
                <td>{sim.bloqueado ? 'SI' : 'NO'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );

  return (
    <Container>
      <Card>
        <CardContent>
          <Box mb={2}>{inputBuscar}</Box>

          <ReactTablePagination
            data={data}
            loading={loading}
            setPage={setPage}
            setLimit={setLimit}
            info={infoData}
            pagination
            columns={[
              {
                header: '',
                Cell: (row) => (
                  <button
                    type="button"
                    style={{ cursor: "pointer", border: "none", background: "transparent" }}
                    onClick={() =>
                      setData((prev) =>
                        prev.map((r) =>
                          r.value === row.value ? { ...r, open: !row.open, collapseElement: collapseDetalle(row) } : r
                        )
                      )
                    }
                  >
                    {row.open ? 'v' : '>'}
                  </button>
                ),
                align: 'center'
              },
              {
                header: 'Acciones',
                buttons: [
                  {
                    icon: 'mdi:cash-register',
                    color: 'success',
                    onClick: (row) => {
                      const deuda = Number(row.total_pendiente || 0);
                      if (deuda <= 0) return;
                      setSelectedRow(row);
                      setOpenFact(true);
                    }
                  }
                ],
                align: 'center'
              },
              {
                header: 'Cliente',
                Cell: (row) => (
                  <div>
                    <strong>{row.nombres}</strong>
                    <br />
                    <small>{row.documento_identidad}</small>
                  </div>
                )
              },
              { header: 'IMEI', accessor: 'imei', align: 'center' },
              { header: 'Celular', accessor: 'celular', align: 'center' },
              { header: 'Sede', Cell: (row) => getSede(row.sede_id), align: 'center' },
              {
                header: 'Direccion',
                Cell: (row) => <div>{row.direccion_servicio ?? ''}</div>,
                align: 'center'
              },
              {
                header: 'Deuda',
                Cell: (row) => {
                  const d = Number(row.total_pendiente || 0);
                  return (
                    <Label variant="soft" color={d > 0 ? 'error' : 'success'}>
                      S/ {d.toFixed(2)}
                    </Label>
                  );
                },
                align: 'center'
              },
              {
                header: 'Inicio',
                Cell: (row) => moment(row.fecha_inicio).format('YYYY-MM-DD'),
                align: 'center'
              }
            ]}
          />
        </CardContent>
      </Card>
      <ModalFacturarPendientes open={openFact} onClose={() => setOpenFact(false)} selectedRow={selectedRow} />
    </Container>
  );
};

export default HistoricoClienteRouters;

