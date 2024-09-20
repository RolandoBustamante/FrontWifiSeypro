import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from "../auth/AuthGuard";
const ClientesPage= Loadable(lazy(()=>import('views/registros/clientes')))
const RastreadorPage= Loadable(lazy(()=>import('views/registros/gps')))
const VehiculoPage= Loadable(lazy(()=>import('views/registros/vehiculos')))
const RoutePage= Loadable(lazy(()=>import('views/registros/routes')))
const SimsPage= Loadable(lazy(()=>import('views/registros/chips')))

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
            path: 'routers',
            element: <RoutePage/>
        },
        {
            path: 'vehiculo',
            element: <VehiculoPage/>
        },
        {
            path: 'sims',
            element: <SimsPage/>
        }
    ]

}
export default RegistrosRoute