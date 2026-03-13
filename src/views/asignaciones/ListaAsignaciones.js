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
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import Toast from "../../utils/toastUtil";
import Asignaciones from "../../Models/Asignaciones";
import Usuario from "../../Models/Usuario";
import useAsyncSelect from "../../customHooks/useAsyncSelect";
import { useAuthContext } from "../../auth/useAuthContext";
import Clientes from "../../Models/Clientes";
import useSelect from "../../customHooks/useSelect";
import { departamentos, distritos, provincias } from "../../utils/constantes";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import useMountedRef from "../../customHooks/useMountedRef";

const fDate = (v) => (v ? new Date(v).toLocaleString("es-PE") : "-");
const TIPOS_CELULAR = ["Whatsapp", "Llamadas", "Principal", "Secundario", "Otro", "Completo"];
const getDniPendiente = (nota = "") => {
  const match = String(nota).match(/PENDIENTE_CLIENTE_DNI:([^\s|]+)/);
  return match?.[1] ?? "";
};
const getNotaPendienteLimpia = (nota = "") => {
  if (!nota) return "Pendiente de registro de cliente";
  const parts = String(nota)
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("PENDIENTE_CLIENTE_DNI:"))
    .filter((p) => !p.startsWith("REGULARIZADO:"));
  return parts.length ? parts.join(" | ") : "Pendiente de registro de cliente";
};
const formatEstado = (value = "") =>
  String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ListaAsignaciones = () => {
  const mountedRef = useMountedRef();
  const { sesion } = useAuthContext();
  const isMaster = sesion?.rol?.codigo === "01";

  const [loading, setLoading] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);
  const [pendientesPorAsignar, setPendientesPorAsignar] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [pageActivas, setPageActivas] = useState(null);
  const [limitActivas, setLimitActivas] = useState(10);
  const [infoActivas, setInfoActivas] = useState({});
  const [pagePendientes, setPagePendientes] = useState(null);
  const [limitPendientes, setLimitPendientes] = useState(10);
  const [infoPendientes, setInfoPendientes] = useState({});
  const [repartidores, setRepartidores] = useState([]);
  const [repId, selectRep, , , setOptsRep] = useAsyncSelect({ labelPlace: "Repartidor" });

  const [entregaOpen, setEntregaOpen] = useState(false);
  const [asigTarget, setAsigTarget] = useState(null);
  const [modoEntrega, setModoEntrega] = useState("CON_CLIENTE");
  const [clienteId, selectCliente, setClienteId, , setOptsCliente] = useAsyncSelect({
    labelPlace: "Cliente",
    modelo: { Model: Clientes, respuesta: "clientesParam", getByParam: "getByParamCliente" },
  });
  const [clienteRapidoOpen, setClienteRapidoOpen] = useState(false);
  const [clienteRapidoData, setClienteRapidoData] = useState(null);
  const [depRapido, selectDepRapido, setDepRapido, , setOptsDepRapido, , , setDisabledDepRapido] = useSelect({
    placeholder: "Departamento",
  });
  const [provRapido, selectProvRapido, setProvRapido, , setOptsProvRapido, , , setDisabledProvRapido] = useSelect({
    placeholder: "Provincia",
  });
  const [distRapido, selectDistRapido, setDistRapido, , setOptsDistRapido, , , setDisabledDistRapido] = useSelect({
    placeholder: "Distrito",
  });
  const [clienteForm, setClienteForm] = useState({
    documento_identidad: "",
    nombres: "",
    direccion: "",
    numero_direccion: "",
    correo: "",
    celular: "",
    celular_tipo: "Principal",
  });
  const [dniRef, setDniRef] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [direccionServicio, setDireccionServicio] = useState("");
  const [motivoEntrega, setMotivoEntrega] = useState("");

  const [devolverOpen, setDevolverOpen] = useState(false);
  const [sedeDestino, selectSedeDestino, setSedeDestino, , setOptsSedeDestino] = useSelect({ placeholder: "Sede destino" });
  const [motivoDev, setMotivoDev] = useState("");

  const [reasignarOpen, setReasignarOpen] = useState(false);
  const [repartidorNuevoId, selectRepartidorNuevo, setRepartidorNuevoId, , setOptsRepartidorNuevo] = useAsyncSelect({
    labelPlace: "Repartidor destino",
  });
  const [motivoReasignar, setMotivoReasignar] = useState("");
  const [notaReasignar, setNotaReasignar] = useState("");

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
        setRepartidores(users);
        setOptsRep(users.map((u) => ({ value: u.id, label: `${u.nombres} ${u.apellidos}`.trim() })));
      }
    } catch {
      Toast.Error("Error cargando datos base");
    }
  };

  const loadAsignaciones = async () => {
    setLoading(true);
    try {
      const [activasRes, entregadasRes] = await Promise.all([
        Asignaciones.routersAsignados(pageActivas, limitActivas, isMaster ? repId || null : null, null),
        Asignaciones.routersAsignados(pagePendientes, limitPendientes, isMaster ? repId || null : null, "ENTREGADO"),
      ]);
      if (!mountedRef.current) return;
      const dataActivas = activasRes?.data?.routersAsignados?.data ?? {};
      const dataPendientes = entregadasRes?.data?.routersAsignados?.data ?? {};
      const activas = dataActivas?.asignaciones ?? [];
      const entregadas = dataPendientes?.asignaciones ?? [];
      setAsignaciones(activas);
      setInfoActivas(dataActivas?.info ?? {});
      setPendientesPorAsignar(
        entregadas.filter((a) => !a?.activa && a?.router?.estado === "POR_ASIGNAR")
      );
      setInfoPendientes(dataPendientes?.info ?? {});
    } catch {
      Toast.Error("Error cargando asignaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase().then();
  }, []);

  useEffect(() => {
    setPageActivas(0);
    setPagePendientes(0);
  }, [repId]);

  useEffect(() => {
    loadAsignaciones().then();
  }, [repId, pageActivas, limitActivas, pagePendientes, limitPendientes]);

  const openEntrega = (row) => {
    setAsigTarget(row);
    setModoEntrega("CON_CLIENTE");
    setClienteId("");
    setClienteRapidoData(null);
    setClienteForm({
      documento_identidad: "",
      nombres: "",
      direccion: "",
      numero_direccion: "",
      correo: "",
      celular: "",
      celular_tipo: "Principal",
    });
    setDepRapido("");
    setProvRapido("");
    setDistRapido("");
    setOptsCliente([]);
    setDniRef("");
    setFechaInicio("");
    setDireccionServicio("");
    setMotivoEntrega("");
    setEntregaOpen(true);
  };

  const onEntregar = async () => {
    if (!asigTarget?.id) return;
    const esRegularizacion = !asigTarget?.activa && asigTarget?.router?.estado === "POR_ASIGNAR";
    const data = { asignacion_id: asigTarget.id, motivo: motivoEntrega || null };
    const esModoPorAsignar = !esRegularizacion && modoEntrega === "POR_ASIGNAR";
    if (esModoPorAsignar) {
      if (!dniRef) return Toast.Warning("Ingresa DNI referencia");
      data.modo = "POR_ASIGNAR";
      data.dni_referencia = dniRef;
    } else {
      if (clienteRapidoData) {
        data.cliente = clienteRapidoData;
      } else {
        if (!clienteId) return Toast.Warning("Selecciona cliente");
        data.cliente_id = clienteId;
      }
      data.fecha_inicio = fechaInicio || new Date().toISOString().slice(0, 10);
      data.direccion_servicio = direccionServicio || null;
    }

    Toast.Waiting("Guardando entrega...");
    try {
      if (esRegularizacion) {
        await Asignaciones.regularizarRouterPorAsignar(data);
      } else {
        await Asignaciones.entregarRouterCliente(data);
      }
      Toast.Remove();
      Toast.Success(esRegularizacion ? "Pendiente regularizado" : "Entrega registrada");
      setEntregaOpen(false);
      loadAsignaciones().then();
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "No se pudo registrar");
    }
  };

  const onGuardarClienteRapido = () => {
    if (!clienteForm.nombres || !depRapido || !provRapido || !distRapido) {
      return Toast.Warning("Completa datos minimos del cliente");
    }
    setClienteRapidoData({
      ...clienteForm,
      departamento: depRapido,
      provincia: provRapido,
      distrito: distRapido,
      celulares: clienteForm.celular ? [{ tipo: clienteForm.celular_tipo || "Principal", numero: clienteForm.celular }] : [],
    });
    setClienteId("");
    setClienteRapidoOpen(false);
    Toast.Success("Cliente rapido listo para entrega");
  };

  const buscarDocumentoRapido = async () => {
    if (!clienteForm.documento_identidad) return Toast.Warning("Ingresa documento");
    Toast.Waiting("Buscando documento...");
    try {
      const response = await Usuario.consultDNIRUC(clienteForm.documento_identidad);
      if (!mountedRef.current) return;
      const payload = response?.data?.consultDNIRUC?.data ?? {};
      if (!payload.success) {
        Toast.Remove();
        Toast.Warning(payload?.data?.error ?? "No se encontraron datos");
        return;
      }
      const nombre = payload?.data?.datos ?? "";
      if (nombre) {
        setClienteForm((prev) => ({ ...prev, nombres: nombre }));
      }
      Toast.Remove();
    } catch (e) {
      Toast.Remove();
      Toast.Error("No se pudo consultar documento");
    }
  };

  useEffect(() => {
    const optsDep = departamentos.map((d) => ({ value: d.id_ubigeo, label: d.nombre_ubigeo }));
    setOptsDepRapido(optsDep);
    setDisabledDepRapido(false);
    setDisabledProvRapido(true);
    setDisabledDistRapido(true);
    if (!depRapido) {
      setDepRapido("");
      setProvRapido("");
      setDistRapido("");
      setOptsProvRapido([]);
      setOptsDistRapido([]);
    }
    if (optsDep.length === 0) setDisabledDepRapido(true);
  }, []);

  useEffect(() => {
    if (!depRapido) {
      setProvRapido("");
      setDistRapido("");
      setOptsProvRapido([]);
      setOptsDistRapido([]);
      setDisabledProvRapido(true);
      setDisabledDistRapido(true);
      return;
    }
    const optsProv = (provincias[depRapido] ?? []).map((p) => ({ value: p.id_ubigeo, label: p.nombre_ubigeo }));
    setOptsProvRapido(optsProv);
    setProvRapido("");
    setDistRapido("");
    setOptsDistRapido([]);
    setDisabledProvRapido(false);
    setDisabledDistRapido(true);
  }, [depRapido]);

  useEffect(() => {
    if (!provRapido) {
      setDistRapido("");
      setOptsDistRapido([]);
      setDisabledDistRapido(true);
      return;
    }
    const optsDist = (distritos[provRapido] ?? []).map((d) => ({ value: d.id_ubigeo, label: d.nombre_ubigeo }));
    setOptsDistRapido(optsDist);
    setDistRapido("");
    setDisabledDistRapido(false);
  }, [provRapido]);

  const onDevolver = async () => {
    if (!asigTarget?.id || !sedeDestino) return Toast.Warning("Completa sede destino");
    Toast.Waiting("Procesando devolucion...");
    try {
      await Asignaciones.devolverRouterSede({
        asignacion_id: asigTarget.id,
        sede_destino_id: sedeDestino,
        motivo: motivoDev || null,
      });
      Toast.Remove();
      Toast.Success("Router devuelto");
      setDevolverOpen(false);
      loadAsignaciones().then();
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "No se pudo devolver");
    }
  };

  const onReasignar = async () => {
    if (!asigTarget?.id || !repartidorNuevoId) return Toast.Warning("Selecciona repartidor destino");
    Toast.Waiting("Reasignando...");
    try {
      await Asignaciones.reasignarRouterRepartidor({
        asignacion_id: asigTarget.id,
        repartidor_id: repartidorNuevoId,
        motivo: motivoReasignar || null,
        nota: notaReasignar || null,
      });
      Toast.Remove();
      Toast.Success("Router reasignado");
      setReasignarOpen(false);
      loadAsignaciones().then();
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "No se pudo reasignar");
    }
  };

  const onVerDetalleAsignacion = (row) => {
    const motivo = row?.movimientos?.[0]?.motivo || "-";
    const nota = row?.nota || "-";
    Swal.fire({
      title: "Detalle de asignacion",
      html: `
        <div style="text-align:left">
          <p><b>Router:</b> ${row?.router?.imei || "-"}</p>
          <p><b>Nota:</b> ${nota}</p>
          <p><b>Motivo:</b> ${motivo}</p>
        </div>
      `,
      confirmButtonText: "Cerrar",
    });
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3">Asignaciones</Typography>
            <Alert severity="info">
              Consulta y gestiona asignaciones activas de routers segun tu perfil de acceso.
            </Alert>
            <Grid container spacing={2}>
              {isMaster && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>{selectRep}</FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <Button variant="outlined" onClick={() => loadAsignaciones()}>Refrescar</Button>
              </Grid>
            </Grid>

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Asignaciones activas" />
              <Tab label={`Pendientes por asignar (${pendientesPorAsignar.length})`} />
            </Tabs>

            {tabValue === 0 && (
              <ReactTablePagination
                data={asignaciones.filter((a) => a.activa)}
                setLimit={setLimitActivas}
                setPage={setPageActivas}
                info={infoActivas}
                pagination
                loading={loading}
                columns={[
                  {
                    header: "Acciones",
                    align: "center",
                    Cell: (row) => (
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button size="small" variant="contained" onClick={() => openEntrega(row)}>Entregar/Asignar</Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setAsigTarget(row);
                            setSedeDestino(sesion?.sede_seleccionada || "");
                            setMotivoDev("");
                            setDevolverOpen(true);
                          }}
                        >
                          Devolver
                        </Button>
                      {isMaster && (
                        <Button
                          size="small"
                          variant="text"
                            onClick={() => {
                              setAsigTarget(row);
                              setRepartidorNuevoId("");
                              setOptsRepartidorNuevo(
                                repartidores
                                  .filter((r) => r.id !== row?.repartidor_id)
                                  .map((r) => ({ value: r.id, label: `${r.nombres} ${r.apellidos}`.trim() }))
                              );
                              setMotivoReasignar("");
                              setNotaReasignar("");
                              setReasignarOpen(true);
                            }}
                          >
                          Reasignar
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="text"
                        title="Ver detalle"
                        onClick={() => onVerDetalleAsignacion(row)}
                      >
                        <Icon icon="mdi:eye" width={18} />
                      </Button>
                    </Stack>
                  ),
                },
                  { header: "Router", align: "center", Cell: (row) => row?.router?.imei || "-" },
                  { header: "Estado Router", align: "center", Cell: (row) => formatEstado(row?.router?.estado || "-") },
                  { header: "Repartidor", align: "center", Cell: (row) => `${row?.repartidor?.nombres || ""} ${row?.repartidor?.apellidos || ""}`.trim() },
                  { header: "Asignado", align: "center", Cell: (row) => fDate(row.asignado_en) },
                ]}
              />
            )}

            {tabValue === 1 && (
              <ReactTablePagination
                data={pendientesPorAsignar}
                setLimit={setLimitPendientes}
                setPage={setPagePendientes}
                info={infoPendientes}
                pagination
                loading={loading}
                columns={[
                  {
                    header: "Acciones",
                    align: "center",
                    Cell: (row) => (
                      <Button size="small" variant="contained" onClick={() => openEntrega(row)}>
                        Registrar cliente
                      </Button>
                    ),
                  },
                  { header: "Router", align: "center", Cell: (row) => row?.router?.imei || "-" },
                  { header: "DNI referencia", align: "center", Cell: (row) => getDniPendiente(row?.nota) || "-" },
                  { header: "Nota", align: "center", Cell: (row) => getNotaPendienteLimpia(row?.nota) },
                  { header: "Repartidor", align: "center", Cell: (row) => `${row?.repartidor?.nombres || ""} ${row?.repartidor?.apellidos || ""}`.trim() },
                  { header: "Entregado", align: "center", Cell: (row) => fDate(row.entregado_en) },
                ]}
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={entregaOpen} onClose={() => setEntregaOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Entrega</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth disabled label="Router" value={asigTarget?.router?.imei || ""} />
            {asigTarget?.activa && (
              <TextField fullWidth select label="Modo" value={modoEntrega} onChange={(e) => setModoEntrega(e.target.value)} SelectProps={{ native: true }}>
                <option value="CON_CLIENTE">Con cliente</option>
                <option value="POR_ASIGNAR">Por asignar</option>
              </TextField>
            )}
            {asigTarget?.activa && modoEntrega === "POR_ASIGNAR" ? (
              <TextField fullWidth label="DNI referencia" value={dniRef} onChange={(e) => setDniRef(e.target.value)} />
            ) : (
              <>
                <FormControl fullWidth>{selectCliente}</FormControl>
                <Button variant="outlined" onClick={() => setClienteRapidoOpen(true)}>Crear cliente rapido</Button>
                {clienteRapidoData && (
                  <Alert severity="success">
                    Cliente rapido seleccionado: {clienteRapidoData.nombres} {clienteRapidoData.documento_identidad ? `(${clienteRapidoData.documento_identidad})` : ""}
                  </Alert>
                )}
                <TextField fullWidth type="date" label="Fecha inicio" InputLabelProps={{ shrink: true }} value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                <TextField fullWidth label="Direccion servicio" value={direccionServicio} onChange={(e) => setDireccionServicio(e.target.value)} />
              </>
            )}
            <TextField fullWidth label="Motivo" value={motivoEntrega} onChange={(e) => setMotivoEntrega(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEntregaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onEntregar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={clienteRapidoOpen} onClose={() => setClienteRapidoOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Cliente Rapido</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Documento de identidad"
                  value={clienteForm.documento_identidad}
                  onChange={(e) => setClienteForm((p) => ({ ...p, documento_identidad: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={buscarDocumentoRapido} edge="end" size="small">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Nombres" value={clienteForm.nombres} onChange={(e) => setClienteForm((p) => ({ ...p, nombres: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={4}>
                {selectDepRapido}
              </Grid>
              <Grid item xs={12} md={4}>
                {selectProvRapido}
              </Grid>
              <Grid item xs={12} md={4}>
                {selectDistRapido}
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField fullWidth label="Direccion" value={clienteForm.direccion} onChange={(e) => setClienteForm((p) => ({ ...p, direccion: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Numero" value={clienteForm.numero_direccion} onChange={(e) => setClienteForm((p) => ({ ...p, numero_direccion: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField fullWidth label="Correo" value={clienteForm.correo} onChange={(e) => setClienteForm((p) => ({ ...p, correo: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField fullWidth label="Celular" value={clienteForm.celular} onChange={(e) => setClienteForm((p) => ({ ...p, celular: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Tipo celular"
                  value={clienteForm.celular_tipo}
                  onChange={(e) => setClienteForm((p) => ({ ...p, celular_tipo: e.target.value }))}
                  SelectProps={{ native: true }}
                >
                  {TIPOS_CELULAR.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClienteRapidoOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onGuardarClienteRapido}>Usar este cliente</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={devolverOpen} onClose={() => setDevolverOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Devolver Router</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth disabled label="Router" value={asigTarget?.router?.imei || ""} />
            <FormControl fullWidth>{selectSedeDestino}</FormControl>
            <TextField fullWidth label="Motivo" value={motivoDev} onChange={(e) => setMotivoDev(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDevolverOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onDevolver}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reasignarOpen} onClose={() => setReasignarOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reasignar Router</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth disabled label="Router" value={asigTarget?.router?.imei || ""} />
            <FormControl fullWidth>{selectRepartidorNuevo}</FormControl>
            <TextField fullWidth label="Motivo" value={motivoReasignar} onChange={(e) => setMotivoReasignar(e.target.value)} />
            <TextField fullWidth label="Nota" value={notaReasignar} onChange={(e) => setNotaReasignar(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReasignarOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onReasignar}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListaAsignaciones;


