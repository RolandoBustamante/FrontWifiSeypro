import React, {useEffect, useState} from 'react';
import {useAuthContext} from "../../auth/useAuthContext";
import {Button, Container, Grid, Stack} from "@mui/material";
import {useSettingsContext} from "../../components/settings";
import {useNavigate} from "react-router";
import CustomBreadcrumbs from "../../components/custom-breadcrumbs";
import {LoadingButton} from "@mui/lab";
import {ArrowForward, Logout} from "@mui/icons-material";
import SedeCard from "./component/SedeCard";

const Sede = ()=>{
    const { themeStretch } = useSettingsContext();
    const { logout, sesion} = useAuthContext()
    const navigate = useNavigate()
    const [sedes, setSedes]= useState([])
    useEffect(()=>{
        setSedes(sesion?.sedes??[])
    },[sesion])
    const handleLogout = async () => {
        try {
            localStorage.removeItem('conversation')
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <Container maxWidth={themeStretch ? false : 'lg'} sx={{ marginTop: 10 }}>
            <CustomBreadcrumbs
                heading="Seleccionar Sede"
                links={[{ name: 'TODAS MIS SEDES' }]}
                action={
                    sesion?.sede_seleccionada ? (
                        <Button color="error" endIcon={<ArrowForward />} onClick={() => navigate('/')}>
                            Volver
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={1}>
                            <LoadingButton
                                color="error"
                                endIcon={<Logout />}
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </LoadingButton>
                        </Stack>
                    )
                }
            />
            <Grid container spacing={3} sx={{ display: 'flex' }}>
                {sedes.map((element)=><SedeCard key={element.id} sede={element} sede_seleccionada={sesion.sede_seleccionada}/>)}
            </Grid>

        </Container>
    )
}
export default Sede