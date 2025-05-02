import {gql} from '@apollo/client';
import apollo from '../utils/apollo';

const client = apollo;

const Qr = {
    obtenerToken: () => {
        const query = gql(`
            query getQr {
                getQr {
                    qr
                    loggedIn
                }
            }
        `);
        return client.query({query, fetchPolicy: 'no-cache'});
    },

    logout: () => {
        const query = gql(`
            query logoutWhatsApp {
                logoutWhatsApp {
                    success
                    message
                }
            }
        `);
        return client.query({query, fetchPolicy: 'no-cache'});
    },
    reiniciarCliente: () => {
        const query = gql(`
        query {
            forceRestartWhatsApp {
                success
                message
            }
        }
    `);
        return client.query({query, fetchPolicy: 'no-cache'});
    }
};

export default Qr;
