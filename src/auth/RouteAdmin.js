import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

RouteAdmin.propTypes = {
    children: PropTypes.node,
};

export default function RouteAdmin({ children }) {
    const { useragent } = useAuthContext();

    if(!useragent || !useragent?.adminMaster ) return <Navigate to="/login" replace />;

    return <> {children} </>;
}
