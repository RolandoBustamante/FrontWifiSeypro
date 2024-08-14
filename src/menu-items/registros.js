import {IconUserPlus, IconGps, IconCar} from '@tabler/icons'
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
            id:'admin-gps',
            title: 'GPS',
            type: 'item',
            url: '/registro/gps',
            icon: IconGps,
            breadcrumbs: false
        },
        {
            id:'admin-vehiculo',
            title: 'Vehiculos',
            type: 'item',
            url: '/registro/vehiculo',
            icon: IconCar,
            breadcrumbs: false
        }
    ]

}
export default registro