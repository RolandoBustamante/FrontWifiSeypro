import {gql} from '@apollo/client';

import apollo from '../utils/apollo';
import moment from "moment";

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
                id, imei, nombre, marca, modelo, serie, numero_chip, sede_id, fecha_compra, fecha_renovacion
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
    }
}
export default Routers