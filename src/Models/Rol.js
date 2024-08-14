import {gql} from '@apollo/client';

import apollo from '../utils/apollo';

const client = apollo;

const Rol={
    getRoles: (recursos)=>{
        const query= gql(`query listRol{
         listRol{${recursos}}}`)
        return client.query({query, fetchPolicy: 'no-cache'})

    },
    getAlRoles: ()=>{
        const query= gql(`query listAllRol {
         listAllRol{${recursos}}}`)
        return client.query({query, fetchPolicy: 'no-cache'})
    },
    //Tipo de ventas
    getListTipoVentas: ()=>{
        const query= gql(`query listTipoVentas {
         listTipoVentas{id, nombre, color, url, icono}}`)
        return client.query({query, fetchPolicy: 'no-cache'})
    },
    getListTipoVentaVehiculo: ()=>{
        const query= gql(`query listTipoVentaVehiculo {
         listTipoVentaVehiculo{id, nombre, color}}`)
        return client.query({query, fetchPolicy: 'no-cache'})
    }
}
export default Rol