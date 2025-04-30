import AuthGuard from "../auth/AuthGuard";
import MainLayout from "../layout/MainLayout";
import ListVentas from "../views/ListVentas";

const lista={
    path:'/lista',
    element: <AuthGuard><MainLayout/></AuthGuard>,
    children: [
        {
            path: 'ventas',
            element: <ListVentas/>
        }
    ]
}
export default lista