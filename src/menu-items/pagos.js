import {IconBrandCashapp} from '@tabler/icons'
const pagos={
    id: 'admin_pagos',
    title: 'Pagos',
    type: 'group',
    children:[
        {
            id: 'pago_general',
            title: 'Pagos',
            type: 'collapse',
            icon: IconBrandCashapp,
            children: [
                {
                    id: 'tipo_pago',
                    title: 'Tipo pagos',
                    type: 'item',
                    url: '/pagos/tipo',
                }
            ]
        }
    ]

}
export default pagos