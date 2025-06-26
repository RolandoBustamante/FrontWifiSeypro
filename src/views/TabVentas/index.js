import React, {useState} from "react"


import {
    Box, Card, CardContent, Tab, Tabs,
} from "@mui/material";
import ListVentas from "../ListVentas";
import ResumenCaja from "../ResumenCaja";

const TabVentas = () => {
    const [currentTab, setCurrentTab] = useState('ventas01')

    const TABS = [
        {
            value: 'ventas01',
            label: 'Lista Ventas',
            component: <ListVentas/>,
        },
        {
            value: 'caja01',
            label: 'Cuadrar Caja',
            component:<ResumenCaja/>
        }
    ]

    return (
        <Card>
            <CardContent>
                <Box>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                            {TABS.map((tab) => (
                                <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value}/>
                            ))}
                        </Tabs>
                    </div>


                    {TABS.map(
                        (tab) =>
                            tab.value === currentTab && (
                                <Box key={tab.value} sx={{mt: 5}}>
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