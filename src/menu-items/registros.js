import {IconUserPlus, IconWifi2, IconCashBanknote} from '@tabler/icons'
const registro={
    id: 'registro',
    title: 'Registros',
    type: 'group',
    children:[
        {
            id:'admin-registros',
            title: 'Clientes',
            type: 'item',
            url: '/registro/clientes',
            icon: IconUserPlus,
            breadcrumbs: false
        },
        {
            id:'admin-routers',
            title: 'Routers',
            type: 'item',
            url: '/registro/routers',
            icon: IconWifi2,
            breadcrumbs: false
        },
        {
            id:'admin-ventas',
            title: 'Ventas',
            type: 'item',
            url: '/registro/routers',
            icon: IconCashBanknote,
            breadcrumbs: false
        }
    ]

}
export default registro