import React, {useState} from "react"


import {
    Box, Card, CardContent, Tab, Tabs,
} from "@mui/material";
import ListVentas from "../ClientesServicio";
import ResumenCaja from "../HistoricoClienteRouters";

const TabVentas = () => {
    const [currentTab, setCurrentTab] = useState('activos01')

    const TABS = [
        {
            value: 'activos01',
            label: 'Clientes-Detalle',
            component: <ListVentas/>,
        },
        {
            value: 'inactivos01',
            label: 'Detalle Historico',
            component:<ResumenCaja/>
        }
    ]

    return (
        <Card>
            <CardContent>
                <Box>
                    <div style={{display: 'flex', justifyContent: 'center', padding:0, margin:0}}>
                        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                            {TABS.map((tab) => (
                                <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value}/>
                            ))}
                        </Tabs>
                    </div>


                    {TABS.map(
                        (tab) =>
                            tab.value === currentTab && (
                                <Box key={tab.value} sx={{mt: 5}} style={{padding:0, margin:0}}>
                                    {tab.component}
                                </Box>
                            )
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}
export default TabVentas