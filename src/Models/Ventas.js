import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Ventas = {
    createOrUpdateRouters: (data) => {
        const mutation = gql(`mutation createOrUpdateClienteRouter($data: JSONObject!){
            createOrUpdateClienteRouter(data: $data){
                id, 
            }
        }`)
        return client.mutate({mutation, variables: {data}, fetchPolicy: 'no-cache'})
    },
    updateFree: (id, gratis) => {
        const mutation = gql(`mutation updateFree($id: String!, $gratis: Boolean!){
            updateFree(id: $id, gratis: $gratis){
                data
            }
        }`)
        return client.mutate({mutation, variables: {id, gratis}, fetchPolicy: 'no-cache'})
    },
    emitirFactura: (json) => {
        const query = gql(`
      query emitirFactura($json: JSONObject!){
       emitirFactura(json: $json){
            data
        }
     }
    `)
        return client.query({query, variables: {json}, fetchPolicy: 'no-cache'})
    },
    enviarComprobante: (url, numero) => {
        const query = gql(`
      query enviarComprobante($url: String!, $numero: String!){
       enviarComprobante(url: $url, numero: $numero){
            success
        }
     }
    `)
        return client.query({query, variables: {url, numero}, fetchPolicy: 'no-cache'})
    },
    operacionesSimplificadas: () => {
        const query = gql(`
    query listOperaciones {
      listOperaciones {
        data
      }
    }
  `);

        return client.query({
            query,
            fetchPolicy: 'no-cache'
        });
    },
    obtenerRuta: (id) => {
        const query = gql(`
      query obtenerRuta($id: String!){
       obtenerRuta(id: $id){
            label
        }
     }
    `)
        return client.query({query, variables: {id}, fetchPolicy: 'no-cache'})
    },
    anularComprobante: (id, motivo) => {
        const query = gql(`
      query anularOperacion($id: String!, $motivo: String!){
       anularOperacion(id: $id, motivo: $motivo){
            success
        }
     }
    `)
        return client.query({query, variables: {id, motivo}, fetchPolicy: 'no-cache'})
    },
}
export default Ventas