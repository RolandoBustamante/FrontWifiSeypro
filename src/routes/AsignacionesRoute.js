import { lazy } from "react";
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import AuthGuard from "../auth/AuthGuard";
import { Navigate } from "react-router-dom";

const AsignarRepartoPage = Loadable(lazy(() => import("views/asignaciones/AsignarReparto")));
const ListaAsignacionesPage = Loadable(lazy(() => import("views/asignaciones/ListaAsignaciones")));
const MovimientosPage = Loadable(lazy(() => import("views/asignaciones/Movimientos")));
const RecojosPage = Loadable(lazy(() => import("views/asignaciones/Recojos")));

const AsignacionesRoute = {
  path: "/asignaciones",
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: "",
      element: <Navigate to="/asignaciones/lista" replace />,
    },
    {
      path: "reparto",
      element: <AsignarRepartoPage />,
    },
    {
      path: "lista",
      element: <ListaAsignacionesPage />,
    },
    {
      path: "movimientos",
      element: <MovimientosPage />,
    },
    {
      path: "recojos",
      element: <RecojosPage />,
    },
  ],
};

export default AsignacionesRoute;
