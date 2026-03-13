import React, { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, Container, Grid, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import Toast from "../../utils/toastUtil";
import Asignaciones from "../../Models/Asignaciones";
import Usuario from "../../Models/Usuario";
import { useAuthContext } from "../../auth/useAuthContext";
import useAsyncSelect from "../../customHooks/useAsyncSelect";
import Routers from "../../Models/Routers";
import useSelect from "../../customHooks/useSelect";
import Label from "../../components/label";
import useInput from "../../customHooks/useInput";
import useMountedRef from "../../customHooks/useMountedRef";

const fDate = (v) => (v ? new Date(v).toLocaleString("es-PE") : "-");
const formatLabel = (value = "") =>
  String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
const formatMotivo = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "-";
  if (raw.includes(":")) {
    const [prefix, rest] = raw.split(":");
    const p = formatLabel(prefix);
    const r = formatLabel(rest);
    return `${p}: ${r}`;
  }
  return formatLabel(raw);
};
const TIPO_LABEL = {
  TRASLADO_SEDE: "Traslado sede",
  ASIGNACION_REPARTIDOR: "Asignacion repartidor",
  REASIGNACION_REPARTIDOR: "Reasignacion repartidor",
  ENTREGA_CLIENTE: "Entrega cliente",
  DEVOLUCION_SEDE: "Devolucion sede",
};
const TIPO_COLOR = {
  TRASLADO_SEDE: "primary",
  ASIGNACION_REPARTIDOR: "info",
  REASIGNACION_REPARTIDOR: "warning",
  ENTREGA_CLIENTE: "success",
  DEVOLUCION_SEDE: "error",
};

const Movimientos = () => {
  const mountedRef = useMountedRef();
  const { sesion } = useAuthContext();
  const isMaster = sesion?.rol?.codigo === "01";
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [repartidorId, selectRep, , , setOptsRep] = useAsyncSelect({ labelPlace: "Repartidor" });

  const [routerIdTras, selectRouterTras, setRouterIdTras] = useAsyncSelect({
    labelPlace: "Router",
    modelo: { Model: Routers, respuesta: "routersParam", getByParam: "getByParam" },
  });
  const [sedeDestinoTras, selectSedeDestinoTras, , , setOptsSedeDestinoTras] = useSelect({ placeholder: "Sede destino" });
  const [motivoTras, setMotivoTras] = useState("");

  const [historial, setHistorial] = useState([]);
  const [pageHistorial, setPageHistorial] = useState(null);
  const [limitHistorial, setLimitHistorial] = useState(10);
  const [infoHistorial, setInfoHistorial] = useState({});
  const [routerImeiHist, inputRouterImeiHist] = useInput({
    placeholder: "Router (IMEI)",
    typeState: "text",
  });
  const [sedeHist, selectSedeHist, , , setOptsSedeHist] = useSelect({ placeholder: "Sede" });
  const [tipoHist, setTipoHist] = useState("");

  const loadBase = async () => {
    try {
      const [sRes, rRes] = await Promise.all([
        Usuario.allSedes(),
        isMaster ? Asignaciones.listRepartidores(1, 200) : Promise.resolve(null),
      ]);
      if (!mountedRef.current) return;
      const sedes = sRes?.data?.allSedes ?? [];
      const optsSedes = sedes.map((s) => ({ value: s.id, label: s.nombre }));
      setOptsSedeDestinoTras(optsSedes);
      setOptsSedeHist([{ value: "", label: "Todas" }, ...optsSedes]);
      if (isMaster) {
        const users = rRes?.data?.listRepartidores?.data?.usuarios ?? [];
        setOptsRep(users.map((u) => ({ value: u.id, label: `${u.nombres} ${u.apellidos}`.trim() })));
      }
    } catch {
      Toast.Error("Error cargando catalogos");
    }
  };

  const loadHistorial = async () => {
    setLoading(true);
    try {
      const r = await Asignaciones.historialRouterMovimientos(
        pageHistorial,
        limitHistorial,
        null,
        routerImeiHist || null,
        isMaster ? repartidorId || null : null,
        sedeHist || null,
        tipoHist || null
      );
      if (!mountedRef.current) return;
      const data = r?.data?.historialRouterMovimientos?.data ?? {};
      setHistorial(data?.movimientos ?? []);
      setInfoHistorial(data?.info ?? {});
    } catch {
      Toast.Error("Error cargando historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase().then();
  }, []);

  useEffect(() => {
    loadHistorial().then();
  }, [pageHistorial, limitHistorial]);

  useEffect(() => {
    setPageHistorial(0);
  }, [routerImeiHist, repartidorId, sedeHist, tipoHist]);

  const onTrasladar = async () => {
    if (!routerIdTras || !sedeDestinoTras) return Toast.Warning("Completa router_id y sede destino");
    Toast.Waiting("Trasladando...");
    try {
      await Asignaciones.trasladarRouterSede({
        router_id: routerIdTras,
        sede_destino_id: sedeDestinoTras,
        motivo: motivoTras || null,
      });
      Toast.Remove();
      Toast.Success("Traslado registrado");
      setRouterIdTras("");
      setMotivoTras("");
      loadHistorial().then();
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "No se pudo trasladar");
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3">Movimientos</Typography>
            <Alert severity="info">Traslado e historial de movimientos de routers.</Alert>
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
              <Tab label="Traslado" />
              <Tab label="Historial" />
            </Tabs>

            {tab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  {selectRouterTras}
                </Grid>
                <Grid item xs={12} md={4}>
                  {selectSedeDestinoTras}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Motivo" value={motivoTras} onChange={(e) => setMotivoTras(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={onTrasladar}>Registrar Traslado</Button>
                </Grid>
              </Grid>
            )}

            {tab === 1 && (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    {inputRouterImeiHist}
                  </Grid>
                  {isMaster && (
                    <Grid item xs={12} md={3}>{selectRep}</Grid>
                  )}
                  <Grid item xs={12} md={3}>
                    {selectSedeHist}
                  </Grid>
                  <Grid item xs={12} md={3}>
            <TextField fullWidth select label="Tipo" value={tipoHist} onChange={(e) => setTipoHist(e.target.value)} SelectProps={{ native: true }}>
              <option value="">Todos</option>
              <option value="TRASLADO_SEDE">Traslado sede</option>
              <option value="ASIGNACION_REPARTIDOR">Asignacion repartidor</option>
              <option value="REASIGNACION_REPARTIDOR">Reasignacion repartidor</option>
              <option value="ENTREGA_CLIENTE">Entrega cliente</option>
              <option value="DEVOLUCION_SEDE">Devolucion sede</option>
            </TextField>
                  </Grid>
                </Grid>
                <Button variant="outlined" onClick={() => loadHistorial()}>Buscar</Button>
                <ReactTablePagination
                  data={historial}
                  setLimit={setLimitHistorial}
                  setPage={setPageHistorial}
                  info={infoHistorial}
                  pagination
                  loading={loading}
                  columns={[
                    { header: "Fecha", align: "center", Cell: (row) => fDate(row.creado_en) },
                    {
                      header: "Tipo",
                      align: "center",
                      Cell: (row) => (
                        <Label
                          variant="soft"
                          color={TIPO_COLOR[row?.tipo] || "default"}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {TIPO_LABEL[row?.tipo] || formatLabel(row?.tipo) || "-"}
                        </Label>
                      ),
                    },
                    { header: "Router", align: "center", Cell: (row) => row?.router?.imei || "-" },
                    { header: "Origen", align: "center", Cell: (row) => row?.sede_origen?.nombre || row?.usuario_origen?.nombres || "-" },
                    { header: "Destino", align: "center", Cell: (row) => row?.sede_destino?.nombre || row?.usuario_destino?.nombres || row?.cliente_destino?.nombres || "-" },
                    { header: "Motivo", align: "center", Cell: (row) => formatMotivo(row?.motivo) },
                  ]}
                />
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Movimientos;


