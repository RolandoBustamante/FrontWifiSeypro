import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Routers={
    listRouters: (page, limit, imei, sede, estado)=>{
        const query = gql(`
          query listRouters($page: Int, $limit: Int, $imei: String, $sede: String, $estado: String) {
            listRouters(page: $page, limit: $limit, imei: $imei, sede: $sede, estado: $estado) {
              data
            }
          }
        `);
        return client.query({query, variables: {page, limit, imei, sede, estado}, fetchPolicy: 'no-cache'})
    },
    createOrUpdateRouters: (data)=>{
        const mutation=gql(`mutation createOrUpdateRouters($data: JSONObject!){
            createOrUpdateRouters(data: $data){
                id, imei, marca, modelo, sede_id, fecha_compra, estado, precio_servicio, codigo, id_file,
                chips{id, paquete, fecha_renovacion, marca, activo, usado, sim_card}
            }
        }`)
        return client.mutate({mutation, variables:{data}, fetchPolicy: 'no-cache'})
    },
    gpsNoUtilizado: ()=>{
        const query= gql(`
        query gpsSinUtilizar{
            gpsSinUtilizar{
                value, label
            }
        }
        `)
        return client.query({query, fetchPolicy: 'no-cache'})
    },
    getByParam: (param)=>{
        const query= gql(`
        query routersParam($param: String!){
            routersParam(param: $param){
            value, label
           }
        }
        `)
        return client.query({query,variables:{param}, fetchPolicy: 'no-cache'})
    },
    obtenerCodigo: ()=>{
        const query= gql(`
        query obtenerCodigoPago{
            obtenerCodigoPago{
                label
            }
        }
        `)
        return client.query({query, fetchPolicy: 'no-cache'})
    },
    getById: (id, recursos)=>{
        const query= gql(`
        query routerById($id: String!){
            routerById(id: $id){
                ${recursos}
            }
        }
        `)
        return client.query({query, variables:{id}, fetchPolicy: 'no-cache'})
    },
    cancelarClienteRouter: (data)=>{
        const query=gql(`query cancelarClienteRouter($data: JSONObject!){
            cancelarClienteRouter(data: $data){
                success
            }
        }`)
        return client.query({query, variables:{data}, fetchPolicy: 'no-cache'})
    },
}
export default Routers