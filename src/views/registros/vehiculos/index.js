import { useState } from 'react';
// @mui
import {Container, Tab, Tabs, Box, CardContent, Card} from '@mui/material';
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import Iconify from "../../../components/iconify";
import {useSettingsContext} from "../../../components/settings";
import MarcasModelos from "./tabs-vehiculos/MarcasModelos";
import TipoVehiculos from "./tabs-vehiculos/TipoVehiculos";
import Vehiculo from "./vehiculo/Index"


export default function Perfil() {
    const { themeStretch } = useSettingsContext();

    const [currentTab, setCurrentTab] = useState('vehiculo');

    const TABS = [
        {
            value: 'vehiculo',
            label: 'Vehículos',
            icon: <Iconify icon="carbon:car" />,
            component: <Vehiculo/>
        },
        {
            value: 'marca',
            label: 'Marca Vehículo',
            icon: <Iconify icon="ant-design:car-twotone" />,
            component: <MarcasModelos/>
        },
        {
            value: 'tipo',
            label: 'Tipo Vehículo',
            icon: <Iconify icon="f7:car-fill" />,
            component: <TipoVehiculos/>
        }
    ];

    return (
        <Card>
            <CardContent>


                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                            {TABS.map((tab) => (
                                <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                            ))}
                        </Tabs>
                    </Box>

                    {TABS.map(
                        (tab) =>
                            tab.value === currentTab && (
                                <Box key={tab.value} sx={{ mt: 5 }}>
                                    {tab.component}
                                </Box>
                            )
                    )}
            </CardContent>
        </Card>
    );

}
