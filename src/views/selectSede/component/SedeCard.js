import { alpha, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import {
    Card,
    Typography,
    CardActionArea,
    Grid,
    Tooltip,
    Stack,
    Dialog,
    DialogTitle,
    DialogActions, Button, DialogContent
} from '@mui/material';
import Iconify from "../../../components/iconify";
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import Label from "../../../components/label";
import {useAuthContext} from "../../../auth/useAuthContext";
import {useNavigate} from "react-router";


const StyledIcon = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}))
const SedeCard= ({sede, sede_seleccionada})=>{
    SedeCard.propTypes = {
        sede: PropTypes.object,
        sede_seleccionada: PropTypes.String
    }
    const navigate = useNavigate()
    const { selectSede} = useAuthContext()

    const [open,setOpen]= useState(false)
    return(
        <Grid item xs={12} sm={6} md={3} xl={3}>
            <Card sx={{ height: '100%' }}>
                <CardActionArea
                    sx={{
                        p: 2,
                        justifyContent: 'center',
                        textAlign: 'center',
                        height: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f5f5f5',
                    }}
                onClick={()=>setOpen(true)}>
                    <Stack direction="row" justifyContent="end">
                        {
                            sede_seleccionada===sede?.id &&(<Label variant="soft" color="error" sx={{ textTransform: 'capitalize' }}>
                            Actual
                            </Label>)
                        }
                    </Stack>
                    <StyledIcon
                        sx={{
                            color: (theme) => theme.palette.primary.dark,
                            backgroundImage: (theme) =>
                                `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
                                    theme.palette.primary.dark,
                                    0.24
                                )} 100%)`,
                        }}
                    >
                        <Iconify icon="mdi:domain" width={24} height={24} />
                    </StyledIcon>
                    <Tooltip title={sede.nombre}>
                        <Typography variant="h6" noWrap>
                            {sede.nombre}
                        </Typography>
                    </Tooltip>
                    <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                        {sede?.codigo??''}
                    </Typography>
                </CardActionArea>
            </Card>
            <Dialog open={open}>
                <DialogTitle>
                    Seleccionar Sede{' '}
                    <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                        {sede?.nombre} | {sede?.codigo}
                    </Typography>{' '}
                </DialogTitle>
                <DialogContent>
                    Desea seleccionar la sede: {sede?.nombre}
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant="contained"
                        color="success"
                        onClick={async () => {
                            await selectSede(sede.id)
                            setOpen(false)
                            navigate('/', { replace: true });
                        }}
                    >
                        Aceptar
                    </LoadingButton>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOpen(false)
                        }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default SedeCard