import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Sims={
    listSims: (page, limit)=>{
        const query=gql(`
            query listChips($page: Int, $limit: Int){
                listChips(page: $page, limit: $limit){
                    data
                }
            }
        `)
        return client.query({query, variables: {page, limit}, fetchPolicy: 'no-cache'})
    },
    createOrSims: (data)=>{
        const mutation=gql(`mutation createOrUpdateSim($data: JSONObject!){
            createOrUpdateSim(data: $data){
                id, sim_card, marca, paquete, fecha_renovacion, activo, sede_id
            }
        }`)
        return client.mutate({mutation, variables:{data}, fetchPolicy: 'no-cache'})
    },
    getChipParam: (param)=>{
        const query=gql(`
            query listChipsSinUtilizar($param: String!){
                listChipsSinUtilizar(param: $param){
                    label, value
                }
            }
        `)
        return client.query({query, variables: {param}, fetchPolicy: 'no-cache'})
    },
    getChipId: (id)=>{
        const query=gql(`
            query getChipId($id: String!){
                getChipId(id: $id){
                    id,paquete, fecha_renovacion, marca, activo, usado, sim_card
                }
            }
        `)
        return client.query({query, variables: {id}, fetchPolicy: 'no-cache'})
    },
}
export default Sims