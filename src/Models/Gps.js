import {gql} from '@apollo/client';

import apollo from '../utils/apollo';
import moment from "moment";

const client = apollo;

const Gps={
    listGps: (page, limit)=>{
        const query=gql(`
            query listGps($page: Int, $limit: Int){
                listGps(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    createOrUpdateGps: (data)=>{
        const mutation=gql(`mutation createOrUpdateGps($data: JSONObject!){
            createOrUpdateGps(data: $data){
                id, producto, imei,marca, modelo, sede_id, nro_sim, fecha_compra
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
        query gpsParam($param: String!){
            gpsParam(param: $param){
            value, label
           }
        }
        `)
        return client.query({query,variables:{param}, fetchPolicy: 'no-cache'})
    }
}
export default Gps