import {lazy} from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from "../auth/GuestGuard";
import SessionGuard from '../auth/SessionGuard';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const SeleccionarSede= Loadable(lazy(()=>import ('views/selectSede/Sede')))

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout/>,
    children: [
        {
            path: 'login',
            element: <GuestGuard><AuthLogin3/></GuestGuard>
        },
        {
            path: 'seleccionar-sede',
            element: <SessionGuard><SeleccionarSede/></SessionGuard>
        }
    ]
};

export default AuthenticationRoutes;
