import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import useAsyncSelect from "../../customHooks/useAsyncSelect";
import useSelect from "../../customHooks/useSelect";
import Asignaciones from "../../Models/Asignaciones";
import Clientes from "../../Models/Clientes";
import Usuario from "../../Models/Usuario";
import Toast from "../../utils/toastUtil";
import { useAuthContext } from "../../auth/useAuthContext";
import useMountedRef from "../../customHooks/useMountedRef";

const fDate = (v) => (v ? new Date(v).toLocaleString("es-PE") : "-");
const getMotivoRecojo = (nota = "") => {
  const m = String(nota).match(/RECOJO:(CAMBIO|BAJA)/i);
  return (m?.[1] ?? "-").toUpperCase();
};

const Recojos = () => {
  const mountedRef = useMountedRef();
  const { sesion } = useAuthContext();
  const isMaster = sesion?.rol?.codigo === "01";
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [clienteId, selectCliente, setClienteId] = useAsyncSelect({
    labelPlace: "Cliente",
    modelo: { Model: Clientes, respuesta: "clientesParam", getByParam: "getByParamCliente" },
  });
  const [routerClienteId, selectRouterCliente, setRouterClienteId, , setOptsRouterCliente] = useSelect({
    placeholder: "Router del cliente",
  });
  const [motivoRecojo, setMotivoRecojo] = useState("CAMBIO");
  const [notaRecojo, setNotaRecojo] = useState("");
  const [repartidorIdReg, selectRepartidorReg, , , setOptsRepartidorReg] = useAsyncSelect({
    labelPlace: "Repartidor",
  });

  const [repartidorIdFiltro, selectRepartidorFiltro, , , setOptsRepartidorFiltro] = useAsyncSelect({
    labelPlace: "Repartidor",
  });
  const [recojos, setRecojos] = useState([]);
  const [pageRecojos, setPageRecojos] = useState(null);
  const [limitRecojos, setLimitRecojos] = useState(10);
  const [infoRecojos, setInfoRecojos] = useState({});

  const [entregarOpen, setEntregarOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [sedeDestino, selectSedeDestino, setSedeDestino, , setOptsSedeDestino] = useSelect({ placeholder: "Sede destino" });
  const [motivoEntrega, setMotivoEntrega] = useState("");

  const loadBase = async () => {
    try {
      const [sedesRes, repRes] = await Promise.all([
        Usuario.allSedes(),
        isMaster ? Asignaciones.listRepartidores(1, 200) : Promise.resolve(null),
      ]);
      if (!mountedRef.current) return;
      const sedes = sedesRes?.data?.allSedes ?? [];
      setOptsSedeDestino(sedes.map((s) => ({ value: s.id, label: s.nombre })));
      if (isMaster) {
        const users = repRes?.data?.listRepartidores?.data?.usuarios ?? [];
        const opts = users.map((u) => ({ value: u.id, label: `${u.nombres} ${u.apellidos}`.trim() }));
        setOptsRepartidorReg(opts);
        setOptsRepartidorFiltro(opts);
      }
    } catch {
      Toast.Error("Error cargando datos base");
    }
  };

  const loadRecojos = async () => {
    setLoading(true);
    try {
      const res = await Asignaciones.recojosAsignados(
        pageRecojos,
        limitRecojos,
        isMaster ? repartidorIdFiltro || null : null,
        null
      );
      if (!mountedRef.current) return;
      const data = res?.data?.recojosAsignados?.data ?? {};
      setRecojos(data?.asignaciones ?? []);
      setInfoRecojos(data?.info ?? {});
    } catch {
      Toast.Error("Error cargando recojos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase().then();
  }, []);

  useEffect(() => {
    if (!clienteId) {
      setRouterClienteId("");
      setOptsRouterCliente([]);
      return;
    }
    Asignaciones.routersActivosCliente(clienteId)
      .then((res) => {
        if (!mountedRef.current) return;
        const opts = res?.data?.routersActivosCliente ?? [];
        setOptsRouterCliente(opts.map((o) => ({ value: o.value, label: o.label })));
        setRouterClienteId("");
      })
      .catch(() => Toast.Error("No se pudo cargar routers del cliente"));
  }, [clienteId]);

  useEffect(() => {
    loadRecojos().then();
  }, [pageRecojos, limitRecojos, repartidorIdFiltro]);

  const onRegistrarRecojo = async () => {
    if (!clienteId || !routerClienteId) return Toast.Warning("Selecciona cliente y router");
    if (isMaster && !repartidorIdReg) return Toast.Warning("Selecciona repartidor");
    Toast.Waiting("Registrando recojo...");
    try {
      await Asignaciones.recogerRouterCliente({
        cliente_router_id: routerClienteId,
        motivo: motivoRecojo,
        nota: notaRecojo || null,
        repartidor_id: isMaster ? repartidorIdReg : null,
      });
      Toast.Remove();
      Toast.Success("Recojo registrado");
      setClienteId("");
      setRouterClienteId("");
      setMotivoRecojo("CAMBIO");
      setNotaRecojo("");
      setTab(1);
      loadRecojos().then();
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "No se pudo registrar");
    }
  };

  const onEntregarSede = async () => {
    if (!target?.id || !sedeDestino) return Toast.Warning("Selecciona sede destino");
    Toast.Waiting("Registrando entrega...");
    try {
      await Asignaciones.entregarRecojoSede({
        asignacion_id: target.id,
        sede_destino_id: sedeDestino,
        motivo: motivoEntrega || null,
      });
      Toast.Remove();
      Toast.Success("Recojo entregado en sede");
      setEntregarOpen(false);
      loadRecojos().then();
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "No se pudo registrar");
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3">Recojos</Typography>
            <Alert severity="info">
              Registra recojos por CAMBIO o BAJA. Los routers de recojo solo pueden entregarse a sede.
            </Alert>

            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Registrar recojo" />
              <Tab label="Recojos activos" />
            </Tabs>

            {tab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>{selectCliente}</FormControl>
                </Grid>
                {isMaster && (
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>{selectRepartidorReg}</FormControl>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>{selectRouterCliente}</FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Motivo"
                    value={motivoRecojo}
                    onChange={(e) => setMotivoRecojo(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="CAMBIO">Cambio</option>
                    <option value="BAJA">Baja</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Nota" value={notaRecojo} onChange={(e) => setNotaRecojo(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={onRegistrarRecojo}>Registrar recojo</Button>
                </Grid>
              </Grid>
            )}

            {tab === 1 && (
              <Stack spacing={2}>
                {isMaster && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>{selectRepartidorFiltro}</FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button variant="outlined" onClick={() => loadRecojos()}>Refrescar</Button>
                    </Grid>
                  </Grid>
                )}
                <ReactTablePagination
                  data={recojos.filter((r) => r.activa)}
                  setLimit={setLimitRecojos}
                  setPage={setPageRecojos}
                  info={infoRecojos}
                  pagination
                  loading={loading}
                  columns={[
                    {
                      header: "Acciones",
                      align: "center",
                      Cell: (row) => (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setTarget(row);
                            setSedeDestino(sesion?.sede_seleccionada || "");
                            setMotivoEntrega("");
                            setEntregarOpen(true);
                          }}
                        >
                          Entregar a sede
                        </Button>
                      ),
                    },
                    { header: "Router", align: "center", Cell: (row) => row?.router?.imei || "-" },
                    { header: "Cliente", align: "center", Cell: (row) => row?.cliente?.nombres || "-" },
                    { header: "Motivo", align: "center", Cell: (row) => getMotivoRecojo(row?.nota) },
                    { header: "Nota", align: "center", Cell: (row) => row?.nota || "-" },
                    { header: "Repartidor", align: "center", Cell: (row) => `${row?.repartidor?.nombres || ""} ${row?.repartidor?.apellidos || ""}`.trim() },
                    { header: "Fecha", align: "center", Cell: (row) => fDate(row.asignado_en) },
                  ]}
                />
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={entregarOpen} onClose={() => setEntregarOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Entregar Recojo a Sede</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth disabled label="Router" value={target?.router?.imei || ""} />
            <FormControl fullWidth>{selectSedeDestino}</FormControl>
            <TextField fullWidth label="Motivo" value={motivoEntrega} onChange={(e) => setMotivoEntrega(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEntregarOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onEntregarSede}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recojos;


