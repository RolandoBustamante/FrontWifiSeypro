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
    listaClientes: (page, limit, buscar)=>{
        const query=gql(`
            query listaClientes($page: Int, $limit: Int, $buscar: String){
                listaClientes(page: $page, limit: $limit, buscar: $buscar){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit, buscar}, fetchPolicy: 'no-cache'})
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
    obtenerRecurso: (driveId)=>{
        const query= gql(`
        query obtenerDrive($driveId: String!){
            obtenerDrive(driveId: $driveId){
            label
           }
        }
        `)
        return client.query({query,variables:{driveId}, fetchPolicy: 'no-cache'})
    },
    listaClientesRoutersAll: (page, limit, param)=>{
        const query=gql(`
            query listaClientesRoutersAllClientes($page: Int, $limit: Int, $param: String){
                listaClientesRoutersAll(page: $page, limit: $limit, param: $param){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit, param}, fetchPolicy: 'no-cache'})
    },
    obtenerDireccion: (id)=>{
        const query= gql(`
        query extraerDireccion($id: String!){
            extraerDireccion(id: $id){
            data
           }
        }
        `)
        return client.query({query,variables:{id}, fetchPolicy: 'no-cache'})
    },
    enviarReciboPorPeriodo: ({
                                 cliente_router_id,
                                 periodo,
                                 enviarWhatsapp,
                                 enviarCorreo,
                                 numero,
                                 correo
                             }) => {
        const query = gql(`
        query enviarRecibosPorPeriodo(
            $cliente_router_id: String!,
            $periodo: String!,
            $enviarWhatsapp: Boolean,
            $enviarCorreo: Boolean,
            $numero: String,
            $correo: String
        ){
            enviarRecibosPorPeriodo(
                cliente_router_id: $cliente_router_id,
                periodo: $periodo,
                enviarWhatsapp: $enviarWhatsapp,
                enviarCorreo: $enviarCorreo,
                numero: $numero,
                correo: $correo
            )
        }
    `);

        return client.query({
            query,
            variables: {
                cliente_router_id,
                periodo,
                enviarWhatsapp,
                enviarCorreo,
                numero,
                correo
            },
            fetchPolicy: 'no-cache'
        });
    },
    listaClientesRoutersHistorico: (page, limit, param)=>{
        const query=gql(`
            query listaClientesRoutersHistorico($page: Int, $limit: Int, $param: String){
                listaClientesRoutersHistorico(page: $page, limit: $limit, param: $param){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit, param}, fetchPolicy: 'no-cache'})
    },
}
export default Clientes