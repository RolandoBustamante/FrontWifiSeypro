import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// components//
import { useAuthContext } from './useAuthContext';
import LoadingScreen from "../components/loading-screen";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to='/' />;
    // return <Navigate to={useragent?.adminMaster ? '/owner/roles' : '/'} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
