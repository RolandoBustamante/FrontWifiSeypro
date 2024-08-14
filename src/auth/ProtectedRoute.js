import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  profile: PropTypes.string.isRequired,
  owner: PropTypes.bool,
};

export default function ProtectedRoute({ profile, children, owner }) {
  const { sesion } = useAuthContext();

  if (owner && sesion.usuario.correo.split('@')[1] === 'analytia.pe') return <> {children} </>;

  if (!sesion.tipoEmpresa) {
    return <Navigate to="/login" replace />;
  }

  if (sesion.tipoEmpresa !== profile) {
    return <Navigate to="/" replace />;
  }

  return <> {children} </>;
}
