import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AdminGuard from "../auth/AdminGuard";

const AdminPage= Loadable(lazy(()=>import('views/admin')))
const VendedorPage= Loadable(lazy(()=>import('views/registros/Vendedores')))
const WhatsappPage= Loadable(lazy(()=>import('views/whatsapp')))
const RolesAdminPage= Loadable(lazy(()=>import('views/rolesPermisos')))

const AdminRoute={
    path:'/admin',
    element: <AdminGuard><MainLayout/></AdminGuard>,
    children:[
        {
            path: 'roles',
            element: <RolesAdminPage/>
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
        }
    ]
}
export default AdminRoute