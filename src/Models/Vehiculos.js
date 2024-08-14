import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Vehiculos = {
    listMarcaModelo: (page, limit, tipo) => {
        const query = gql(`
            query listMarcaModelo($page: Int, $limit: Int, $tipo: Int!){
                listMarcaModelo(page: $page, limit: $limit, tipo: $tipo){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit, tipo}, fetchPolicy: 'no-cache'})
    },
    crearOrActualizar: ({data, tipo}) => {
        const mutation = gql(`mutation crearOActualizarModeloMarcas($data: JSONObject!,$tipo: Int!){
            crearOActualizarModeloMarcas(data: $data, tipo: $tipo){
                id, nombre
            }
        }`)
        return client.mutate({mutation, variables: {data, tipo}, fetchPolicy: 'no-cache'})
    },
    listTipos: (page, limit) => {
        const query = gql(`
            query listTipo($page: Int, $limit: Int){
                listTipo(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    createOrUpdateTipo: (data) => {
        const mutation = gql(`mutation createOrUpdateTipo($data: JSONObject!){
            createOrUpdateTipo(data: $data){
                id, nombre, condicion
            }
        }`)
        return client.mutate({mutation, variables: {data}, fetchPolicy: 'no-cache'})
    },
    marcaModeloTipo: () => {
        const query = gql(`
        query marcaModeloTipo{
            marcaModeloTipo{
                data
            }
        }
        `)
        return client.query({query, fetchPolicy: 'no-cache'})
    },
    createOrUpdate: (data)=>{
        const mutation = gql(`mutation createOrUpdateVehiculo($data: JSONObject!){
            createOrUpdateVehiculo(data: $data){
                id, placa, color,gps{marca, imei, id}, gps_id, tipo_id, modelo_id, marca_id, sede_id
                    sede{nombre},tipo{nombre},
                    modelo{nombre},
                    marca{nombre}
            }
        }`)
        return client.mutate({mutation, variables: {data}, fetchPolicy: 'no-cache'})
    },
    listVehiculos: (page, limit) => {
        const query = gql(`
            query listVehiculo($page: Int, $limit: Int){
                listVehiculo(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    vehiculosParaUso: (param)=>{
        const query= gql(`
        query vehiculosParaUso($param: String!){
            vehiculosParaUso(param: $param){
            value, label
           }
        }
        `)
        return client.query({query,variables:{param}, fetchPolicy: 'no-cache'})
    }


}
export default Vehiculos