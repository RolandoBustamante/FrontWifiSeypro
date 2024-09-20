import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Routers={
    listRouters: (page, limit)=>{
        const query=gql(`
            query listRouters($page: Int, $limit: Int){
                listRouters(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    createOrUpdateRouters: (data)=>{
        const mutation=gql(`mutation createOrUpdateRouters($data: JSONObject!){
            createOrUpdateRouters(data: $data){
                id, imei, marca, modelo, sede_id, fecha_compra, 
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
}
export default Routers