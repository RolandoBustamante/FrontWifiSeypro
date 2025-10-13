import {IconUser, IconUserSearch, IconBrandWhatsapp,IconUserCircle, IconUserMinus, IconBuildingWarehouse} from '@tabler/icons'
const admin={
    id: 'admin',
    title: 'Administrador',
    type: 'group',
    children:[
        {
            id:'admin-user',
            title: 'Usuarios',
            type: 'item',
            url: '/admin/user',
            icon: IconUser,
            breadcrumbs: false
        },
        {
            id:'admin-sedes',
            title: 'Sedes',
            type: 'item',
            url: '/admin/sedes',
            icon: IconBuildingWarehouse,
            breadcrumbs: false
        },
        {
            id:'admin-roles',
            title: 'Roles',
            type: 'item',
            url: '/admin/roles',
            icon: IconUserCircle,
            breadcrumbs: false
        },
        {
            id:'admin-vendedores',
            title: 'Vendedores',
            type: 'item',
            url: '/admin/vendedor',
            icon: IconUserSearch,
            breadcrumbs: false
        },
        {
            id:'admin-whatsapp',
            title: 'Configurar whatsapp',
            type: 'item',
            url: '/admin/whatsapp',
            icon: IconBrandWhatsapp,
            breadcrumbs: false
        },
        {
            id:'admin-nro-aviso',
            title: 'Números avisos',
            type: 'item',
            url: '/admin/nro-aviso',
            icon: IconUserMinus,
            breadcrumbs: false
        }
    ]

}
export default admin