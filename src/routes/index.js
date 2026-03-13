import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoute from "./AdminRoute";
import RegistrosRoute from "./RegistrosRoute";
import PagosRoutes from "./PagosRoutes";
import ListRoute from "./ListRoute";
import AsignacionesRoute from "./AsignacionesRoute";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([AdminRoute, MainRoutes, AuthenticationRoutes, RegistrosRoute, PagosRoutes, ListRoute, AsignacionesRoute]);
}
