import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Login from '../views/pages/authentication/authentication3/Login3';
import { useAuthContext } from './useAuthContext';
import LoadingScreen from '../components/loading-screen';
import Sede from '../views/selectSede/Sede';

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, sesion } = useAuthContext();
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (
        isInitialized &&
        (!isAuthenticated || !sesion?.sede_seleccionada) &&
        pathname !== requestedLocation
    ) {
      setRequestedLocation(pathname);
    }
  }, [isInitialized, isAuthenticated, sesion, pathname, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!sesion?.sede_seleccionada) {
    return <Sede />;
  }

  const hasAccess = sesion?.rol?.accesos?.some((a) => a.url === pathname);
  const isMaster = sesion?.rol?.id === 'd10503e9-847b-48d6-a9ff-a0f182974300';

  if (pathname !== '/' && !hasAccess && !isMaster) {
    return <Navigate to="/" replace />;
  }

  if (requestedLocation && pathname !== requestedLocation && (hasAccess || isMaster || pathname === '/')) {
    const redirectTo = requestedLocation;
    setRequestedLocation(null);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
