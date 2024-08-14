import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from "../auth/AuthGuard";

const Pagos= Loadable(lazy(()=>import('views/pagos')))
const TipoPago= Loadable(lazy(()=>import('views/pagos/tipopago')))

const RegistrosRoute={
    path:'/pagos',
    element: <AuthGuard><MainLayout/></AuthGuard>,
    children: [
        {
            path: 'menu',
            element: <Pagos/>
        },
        {
            path: 'tipo',
            element: <TipoPago/>
        },
    ]

}
export default RegistrosRoute