import {IconUser} from '@tabler/icons'
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
        }
    ]

}
export default admin