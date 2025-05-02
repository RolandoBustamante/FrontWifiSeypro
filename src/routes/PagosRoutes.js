import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from "../auth/AuthGuard";

const TipoPago= Loadable(lazy(()=>import('views/pagos/tipopago')))

const RegistrosRoute={
    path:'/pagos',
    element: <AuthGuard><MainLayout/></AuthGuard>,
    children: [
        {
            path: 'tipo',
            element: <TipoPago/>
        },
    ]

}
export default RegistrosRoute