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
    },
    getByParam: (param)=>{
        const query= gql(`
        query listaClientesRouters($param: String!){
            listaClientesRouters(param: $param){
            value, label
           }
        }
        `)
        return client.query({query,variables:{param}, fetchPolicy: 'no-cache'})
    },
    infoFacturacion: (id)=>{
        const query= gql(`
        query obtenerInfo($id: String!){
            obtenerInfo(id: $id){
            data
           }
        }
        `)
        return client.query({query,variables:{id}, fetchPolicy: 'no-cache'})
    },
    infoSerieNumero: (codigo)=>{
        const query= gql(`
        query obtenerSerieNumero($codigo: String!){
            obtenerSerieNumero(codigo: $codigo){
            serie, numero
           }
        }
        `)
        return client.query({query,variables:{codigo}, fetchPolicy: 'no-cache'})
    },
    getByParamCliente: (param)=>{
        const query= gql(`
        query clientesParam($param: String!){
            clientesParam(param: $param){
            value, label
           }
        }
        `)
        return client.query({query,variables:{param}, fetchPolicy: 'no-cache'})
    },
}
export default Clientes