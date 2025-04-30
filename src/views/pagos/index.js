import React, {useEffect, useState} from "react"
import Rol from "../../Models/Rol";
import { Grid } from '@mui/material';
import {Box, Button, Card, CardActionArea, CardContent, Tooltip} from "@mui/material";
import * as icons from '@tabler/icons'
import {gridSpacing} from "../../store/constant";

const Pagos = () => {
    const [tiposVentas, setTipoVentas] = useState([])
    useEffect(() => {
        Rol.getListTipoVentas().then(response => {
            const {listTipoVentas} = response.data
            setTipoVentas(listTipoVentas)
        })
    }, [])




    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {tiposVentas.map((element, index) => {
                                const IconComponent = icons[element.icono];
                                if (!IconComponent) return null;
                                return (
                                    <Grid item key={index} xs={12} sm={6} md={4}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardActionArea
                                                sx={{
                                                    p: 2,
                                                    justifyContent: 'center',
                                                    textAlign: 'center',
                                                    height: '100%',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                            >
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} sm={6} sx={{ fontSize: '1.5rem' }}> {/* Tamaño de fuente más grande */}
                                                        {element.nombre}
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Tooltip title={element.nombre} placement="left">
                                                            <Box sx={{ color: element.color, marginLeft: 'auto' }}>
                                                                <IconComponent sx={{ fontSize: 40 }} /> {/* Tamaño de icono más grande */}
                                                            </Box>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12}>
                                                        <Tooltip title={element.nombre}>
                                                            <Button sx={{ width: '90%', backgroundColor: element.color, color: 'white', '&:hover': { color: element.color} }}> {}
                                                                Registro
                                                            </Button>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    )

}
export default Pagos