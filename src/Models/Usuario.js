import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Usuario = {
    consulta: () => {
        const query = gql(`
        query consultarCpe {
  consultarCpe{data}
}`);
        return client.query({
            query,
        });
    },
    login: (correo, contrasena) => {
        const query = gql(`
      query login($correo: String!, $contrasena: String!){
       login(correo: $correo, contrasena: $contrasena){
            authorization
        }
     }
    `)
        return client.query({query, variables: {correo, contrasena}, fetchPolicy: 'no-cache'})
    },
    currentUsuario: () => {
        const query = gql(`
      query currentUsuario{
       currentUsuario{
            data
        }
     }
    `)
        return client.query({query})
    },
    selectSede: (sedeId) => {
        const query = gql(`
      query selectSede($sedeId: String!){
       selectSede(sedeId: $sedeId){
            data
        }
     }
    `)
        return client.query({query, variables: {sedeId},fetchPolicy: 'no-cache'})
    },
    logout: ()=>{
        const mutation= gql(`
            mutation logout{
                logout
            }
        `)
        return client.mutate({mutation})
    },
    getDni: (dni)=>{
        const query = gql(`
      query consultDNI($dni: String!){
       consultDNI(dni: $dni){
            data
        }
     }
    `)
        return client.query({query, variables: {dni}, fetchPolicy: 'no-cache'})
    },
    consultDNIRUC: (documento)=>{
        const query = gql(`
      query consultDNIRUC($documento: String!){
       consultDNIRUC(documento: $documento){
            data
        }
     }
    `)
        return client.query({query, variables: {documento}, fetchPolicy: 'no-cache'})
    },
    usuarios:(page,limit)=>{
        const query=gql(`
            query listaUsuarios($page: Int, $limit: Int){
                listaUsuarios(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    createOrUpdate: (data, recursos)=>{
        const mutation=gql(`mutation createOrUpdate($data: JSONObject!){
            createOrUpdate(data: $data){
                ${recursos}
            }
        }`)
        return client.mutate({mutation, variables:{data}, fetchPolicy: 'no-cache'})
    },
    allSedes: ()=>{
        const query=gql(`
               query allSedes {
            allSedes{id, nombre}
          }
        `)
        return client.query({query, fetchPolicy: 'no-cache'})
    }
};
export default Usuario;
