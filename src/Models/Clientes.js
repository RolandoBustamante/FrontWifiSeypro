import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Clientes={
    createOrUpdate: (data, recursos)=>{
        const mutation=gql(`mutation createOrUpdateClientes($data: JSONObject!){
            createOrUpdateClientes(data: $data){
                ${recursos}
            }
        }`)
        return client.mutate({mutation, variables:{data}, fetchPolicy: 'no-cache'})
    },
    listaClientes: (page, limit)=>{
        const query=gql(`
            query listaClientes($page: Int, $limit: Int){
                listaClientes(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    }
}
export default Clientes