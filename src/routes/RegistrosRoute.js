import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from "../auth/AuthGuard";
const ClientesPage= Loadable(lazy(()=>import('views/registros/clientes')))
const RastreadorPage= Loadable(lazy(()=>import('views/registros/gps')))
const VehiculoPage= Loadable(lazy(()=>import('views/registros/vehiculos')))

const RegistrosRoute={
    path:'/registro',
    element: <AuthGuard><MainLayout/></AuthGuard>,
    children: [
        {
            path: 'clientes',
            element: <ClientesPage/>
        },
        {
            path: 'gps',
            element: <RastreadorPage/>
        },
        {
            path: 'vehiculo',
            element: <VehiculoPage/>
        }
    ]

}
export default RegistrosRoute