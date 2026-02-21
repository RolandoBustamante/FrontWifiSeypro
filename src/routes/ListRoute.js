import AuthGuard from "../auth/AuthGuard";
import MainLayout from "../layout/MainLayout";
import ListVentas from "../views/TabVentas";
import ListMovimientos from "../views/MovimientosDetalle"
import MovimientosPendientes from "../views/MovimientosPendientes"

const lista={
    path:'/lista',
    element: <AuthGuard><MainLayout/></AuthGuard>,
    children: [
        {
            path: 'ventas',
            element: <ListVentas/>
        },
        {
            path: 'movimientos',
            element: <ListMovimientos/>
        },
        {
            path: 'movimientos-pendientes',
            element: <MovimientosPendientes/>
        }
    ]
}
export default lista
