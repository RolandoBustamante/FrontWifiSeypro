import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Vendedores={
    createOrUpdate: (data, recursos)=>{
        const mutation=gql(`mutation createOrUpdateVendedores($data: JSONObject!){
            createOrUpdateVendedores(data: $data){
                ${recursos}
            }
        }`)
        return client.mutate({mutation, variables:{data}, fetchPolicy: 'no-cache'})
    },
    listaVendedores: (page, limit)=>{
        const query=gql(`
            query listVendedores($page: Int, $limit: Int){
                listVendedores(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    getByParam: (param)=>{
        const query= gql(`
        query vendedoresParam($param: String!){
            vendedoresParam(param: $param){
            value, label
           }
        }
        `)
        return client.query({query,variables:{param}, fetchPolicy: 'no-cache'})
    }
}
export default Vendedores