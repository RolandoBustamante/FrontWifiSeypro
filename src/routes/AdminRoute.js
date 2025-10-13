import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AdminGuard from "../auth/AdminGuard";

const AdminPage= Loadable(lazy(()=>import('views/admin')))
const VendedorPage= Loadable(lazy(()=>import('views/registros/Vendedores')))
const SedesPage= Loadable(lazy(()=>import('views/Sedes')))
const WhatsappPage= Loadable(lazy(()=>import('views/whatsapp')))
const RolesAdminPage= Loadable(lazy(()=>import('views/rolesPermisos')))
const NumerosAviso= Loadable(lazy(()=>import('views/Avisos')))

const AdminRoute={
    path:'/admin',
    element: <AdminGuard><MainLayout/></AdminGuard>,
    children:[
        {
            path: 'roles',
            element: <RolesAdminPage/>
        },
        {
            path: 'sedes',
            element: <SedesPage/>
        },
        {
            path: 'user',
            element: <AdminPage/>
        },
        {
            path: 'vendedor',
            element: <VendedorPage/>
        },
        {
            path: 'whatsapp',
            element: <WhatsappPage/>
        },
        {
            path: 'nro-aviso',
            element: <NumerosAviso/>
        }
    ]
}
export default AdminRoute