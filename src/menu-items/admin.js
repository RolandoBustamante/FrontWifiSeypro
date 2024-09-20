import {IconUser, IconUserSearch} from '@tabler/icons'
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
            id:'admin-user',
            title: 'Vendedores',
            type: 'item',
            url: '/admin/vendedor',
            icon: IconUserSearch,
            breadcrumbs: false
        }
    ]

}
export default admin