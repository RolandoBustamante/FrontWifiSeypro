import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from "../auth/AuthGuard";
import Facturador from "../views/ventas";
const ClientesPage= Loadable(lazy(()=>import('views/registros/clientes')))
const RastreadorPage= Loadable(lazy(()=>import('views/registros/gps')))
const VehiculoPage= Loadable(lazy(()=>import('views/registros/vehiculos')))
const RoutePage= Loadable(lazy(()=>import('views/registros/routes')))
const SimsPage= Loadable(lazy(()=>import('views/registros/chips')))
const ServiciosPage= Loadable(lazy(()=>import('views/registros/servicios')))
const ClienteServicioPage= Loadable(lazy(()=>import('views/ClientesServicio')))

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
        },
        {
            path: 'cliente-servicio',
            element: <ClienteServicioPage/>
        },
        {
            path: 'ventas',
            element: <Facturador/>
        },
        {
            path: 'servicios',
            element: <ServiciosPage/>
        }
    ]

}
export default RegistrosRoute