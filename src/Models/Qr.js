import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Qr={
    obtenerToken:()=>{
        const query= gql(`
        query getQr{
            getQr{
                qr, loggedIn
            }
        }
        `)
        return client.query({query, fetchPolicy: 'no-cache'})
    }
}
export default Qr