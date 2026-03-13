import React, { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Container, FormControl, Grid, Stack, TextField, Typography } from "@mui/material";
import Toast from "../../utils/toastUtil";
import Asignaciones from "../../Models/Asignaciones";
import useAsyncSelect from "../../customHooks/useAsyncSelect";
import { useAuthContext } from "../../auth/useAuthContext";
import Routers from "../../Models/Routers";

const AsignarReparto = () => {
  const { sesion } = useAuthContext();
  const isMaster = sesion?.rol?.codigo === "01";
  const [routerId, selectRouter, setRouterId] = useAsyncSelect({
    labelPlace: "Router",
    modelo: { Model: Routers, respuesta: "routersParam", getByParam: "getByParam" },
  });
  const [repartidorId, selectRepartidor, setRepartidorId] = useAsyncSelect({
    labelPlace: "Repartidor",
    modelo: { Model: Asignaciones, respuesta: "repartidoresParam", getByParam: "repartidoresParam" },
  });
  const [motivo, setMotivo] = useState("");
  const [nota, setNota] = useState("");

  const onSave = async () => {
    if (!routerId) return Toast.Warning("Selecciona router");
    if (!isMaster) return Toast.Warning("No autorizado");
    if (!repartidorId) return Toast.Warning("Selecciona repartidor");
    Toast.Waiting("Asignando...");
    try {
      await Asignaciones.asignarRouterRepartidor({
        router_id: routerId,
        repartidor_id: repartidorId,
        motivo: motivo || null,
        nota: nota || null,
      });
      Toast.Remove();
      Toast.Success("Router asignado a reparto");
      setRouterId("");
      setMotivo("");
      setNota("");
      setRepartidorId("");
    } catch (e) {
      Toast.Remove();
      Toast.Error(e?.message || "Error al asignar");
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3">Asignar a Reparto</Typography>
            <Alert severity="info">
              Solo se asignan routers libres/devueltos. Si un router ya esta en reparto no se puede volver a asignar.
            </Alert>
            {!isMaster && <Alert severity="warning">Esta vista requiere perfil master.</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>{selectRouter}</FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>{selectRepartidor}</FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Nota" value={nota} onChange={(e) => setNota(e.target.value)} />
              </Grid>
            </Grid>
            <Box>
              <Button variant="contained" onClick={onSave}>Guardar Asignacion</Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AsignarReparto;
