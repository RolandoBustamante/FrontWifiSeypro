import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const TipoVenta={
    createOrUpdateTipoPago: (data) => {
        const mutation = gql(`mutation createOrUpdateTipoPago($data: JSONObject!){
            createOrUpdateTipoPago(data: $data){
                id, nombre, activo, bancarizado
            }
        }`)
        return client.mutate({mutation, variables: {data}, fetchPolicy: 'no-cache'})
    },
    getListTipoBancos: ()=>{
        const query= gql(`query listTipoPago {
         listTipoPago{id, nombre, activo, bancarizado}}`)
        return client.query({query, fetchPolicy: 'no-cache'})
    }
}
export default TipoVenta