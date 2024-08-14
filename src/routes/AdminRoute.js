import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from "../auth/AuthGuard";

const AdminPage= Loadable(lazy(()=>import('views/admin')))

const AdminRoute={
    path:'/admin',
    element: <AuthGuard><MainLayout/></AuthGuard>,
    children:[
        {
            path: 'user',
            element: <AdminPage/>
        }
    ]
}
export default AdminRoute