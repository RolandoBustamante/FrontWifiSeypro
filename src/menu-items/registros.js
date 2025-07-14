import {IconUserPlus, IconWifi2, IconCashBanknote, IconDeviceSim, IconBrandShopee, IconDeviceTablet, IconEyeglass} from '@tabler/icons'
const registro={
    id: 'registro',
    title: 'Registros',
    type: 'group',
    children:[
        {
            id:'admin-sims',
            title: 'SIM-CARDS',
            type: 'item',
            url: '/registro/sims',
            icon: IconDeviceSim,
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
            id:'admin-registros',
            title: 'Clientes',
            type: 'item',
            url: '/registro/clientes',
            icon: IconUserPlus,
            breadcrumbs: false
        },
        {
            id:'admin-servicio',
            title: 'Servicio',
            type: 'item',
            url: '/registro/servicios',
            icon: IconBrandShopee,
            breadcrumbs: false
        },
        {
            id:'admin-cliente-servicio',
            title: 'Clientes-Servicio',
            type: 'item',
            url: '/registro/cliente-servicio',
            icon: IconDeviceTablet,
            breadcrumbs: false
        },

        {
            id:'admin-ventas',
            title: 'Registro Ventas',
            type: 'item',
            url: '/registro/ventas',
            icon: IconCashBanknote,
            breadcrumbs: false
        },
        {
            id:'list-ventas',
            title: 'Lista Ventas',
            type: 'item',
            url: '/lista/ventas',
            icon: IconCashBanknote,
            breadcrumbs: false
        },
        {
            id:'list-detalle-mov',
            title: 'Detalle Cobros',
            type: 'item',
            url: '/lista/movimientos',
            icon: IconEyeglass,
            breadcrumbs: false
        }
    ]

}
export default registro