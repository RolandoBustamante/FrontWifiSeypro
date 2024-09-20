import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AdminGuard from "../auth/AdminGuard";

const AdminPage= Loadable(lazy(()=>import('views/admin')))
const VendedorPage= Loadable(lazy(()=>import('views/registros/Vendedores')))

const AdminRoute={
    path:'/admin',
    element: <AdminGuard><MainLayout/></AdminGuard>,
    children:[
        {
            path: 'user',
            element: <AdminPage/>
        },
        {
            path: 'vendedor',
            element: <VendedorPage/>
        }
    ]
}
export default AdminRoute