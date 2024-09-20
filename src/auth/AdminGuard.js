import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
//
import Login from '../views/pages/authentication/authentication3/Login3';
import { useAuthContext } from './useAuthContext';
import LoadingScreen from "../components/loading-screen";
import Sede from "../views/selectSede/Sede";
import Default from "../views/dashboard/Default";


// ----------------------------------------------------------------------

AdminGuard.propTypes = {
    children: PropTypes.node,
};

export default function AdminGuard({ children }) {
    const { isAuthenticated, isInitialized, sesion} = useAuthContext();
    const { pathname } = useLocation();

    const [requestedLocation, setRequestedLocation] = useState(null);

    if (!isInitialized) {
        return <LoadingScreen />;
    }
    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <Login />;
    }
    if(!sesion?.sede_seleccionada){
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <Sede/>
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }
    if(sesion?.rol?.id!=='d10503e9-847b-48d6-a9ff-a0f182974300'){
        return <Default />
    }

    return <> {children} </>;
}
