import { gql } from "@apollo/client";
import apollo from "../utils/apollo";

const client = apollo;

const Asignaciones = {
  listRepartidores: (page, limit) => {
    const query = gql(`
      query listRepartidores($page: Int, $limit: Int) {
        listRepartidores(page: $page, limit: $limit) {
          data
        }
      }
    `);
    return client.query({ query, variables: { page, limit }, fetchPolicy: "no-cache" });
  },
  repartidoresParam: (param) => {
    const query = gql(`
      query repartidoresParam($param: String!) {
        repartidoresParam(param: $param) {
          value
          label
        }
      }
    `);
    return client.query({ query, variables: { param }, fetchPolicy: "no-cache" });
  },
  routersAsignados: (page, limit, repartidorId, estado) => {
    const query = gql(`
      query routersAsignados($page: Int, $limit: Int, $repartidorId: String, $estado: String) {
        routersAsignados(page: $page, limit: $limit, repartidorId: $repartidorId, estado: $estado) {
          data
        }
      }
    `);
    return client.query({
      query,
      variables: { page, limit, repartidorId, estado },
      fetchPolicy: "no-cache",
    });
  },
  recojosAsignados: (page, limit, repartidorId, estado) => {
    const query = gql(`
      query recojosAsignados($page: Int, $limit: Int, $repartidorId: String, $estado: String) {
        recojosAsignados(page: $page, limit: $limit, repartidorId: $repartidorId, estado: $estado) {
          data
        }
      }
    `);
    return client.query({
      query,
      variables: { page, limit, repartidorId, estado },
      fetchPolicy: "no-cache",
    });
  },
  routersActivosCliente: (cliente_id) => {
    const query = gql(`
      query routersActivosCliente($cliente_id: String!) {
        routersActivosCliente(cliente_id: $cliente_id) {
          value
          label
        }
      }
    `);
    return client.query({ query, variables: { cliente_id }, fetchPolicy: "no-cache" });
  },
  historialRouterMovimientos: (page, limit, routerId, routerImei, repartidorId, sedeId, tipo) => {
    const query = gql(`
      query historialRouterMovimientos(
        $page: Int,
        $limit: Int,
        $routerId: String,
        $routerImei: String,
        $repartidorId: String,
        $sedeId: String,
        $tipo: String
      ) {
        historialRouterMovimientos(
          page: $page,
          limit: $limit,
          routerId: $routerId,
          routerImei: $routerImei,
          repartidorId: $repartidorId,
          sedeId: $sedeId,
          tipo: $tipo
        ) {
          data
        }
      }
    `);
    return client.query({
      query,
      variables: { page, limit, routerId, routerImei, repartidorId, sedeId, tipo },
      fetchPolicy: "no-cache",
    });
  },
  asignarRouterRepartidor: (data) => {
    const mutation = gql(`
      mutation asignarRouterRepartidor($data: JSONObject!) {
        asignarRouterRepartidor(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  reasignarRouterRepartidor: (data) => {
    const mutation = gql(`
      mutation reasignarRouterRepartidor($data: JSONObject!) {
        reasignarRouterRepartidor(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  entregarRouterCliente: (data) => {
    const mutation = gql(`
      mutation entregarRouterCliente($data: JSONObject!) {
        entregarRouterCliente(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  regularizarRouterPorAsignar: (data) => {
    const mutation = gql(`
      mutation regularizarRouterPorAsignar($data: JSONObject!) {
        regularizarRouterPorAsignar(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  recogerRouterCliente: (data) => {
    const mutation = gql(`
      mutation recogerRouterCliente($data: JSONObject!) {
        recogerRouterCliente(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  entregarRecojoSede: (data) => {
    const mutation = gql(`
      mutation entregarRecojoSede($data: JSONObject!) {
        entregarRecojoSede(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  devolverRouterSede: (data) => {
    const mutation = gql(`
      mutation devolverRouterSede($data: JSONObject!) {
        devolverRouterSede(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
  trasladarRouterSede: (data) => {
    const mutation = gql(`
      mutation trasladarRouterSede($data: JSONObject!) {
        trasladarRouterSede(data: $data) {
          success
          data
        }
      }
    `);
    return client.mutate({ mutation, variables: { data }, fetchPolicy: "no-cache" });
  },
};

export default Asignaciones;
