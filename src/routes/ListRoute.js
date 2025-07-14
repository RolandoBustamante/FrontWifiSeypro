import AuthGuard from "../auth/AuthGuard";
import MainLayout from "../layout/MainLayout";
import ListVentas from "../views/TabVentas";
import ListMovimientos from "../views/MovimientosDetalle"

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
        }
    ]
}
export default lista