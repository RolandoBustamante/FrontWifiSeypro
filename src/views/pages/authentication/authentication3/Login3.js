import {Link} from 'react-router-dom';

// material-ui
import {Box, Grid, Stack} from '@mui/material';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useInput from "../../../../customHooks/useInput";
import {useState} from "react";
import * as Yup from 'yup'
import useInputPass from "../../../../customHooks/useInputPass";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
import {useAuthContext} from "../../../../auth/useAuthContext";
import {Alert, LoadingButton} from "@mui/lab";

const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
})
const Login = () => {
    const {login} = useAuthContext();
    const methods = useForm({
        resolver: yupResolver(LoginSchema),
    });

    const {
        reset,
        setError,
        formState: {errors},
    } = methods;
    const [cuenta, inputCuenta, , setInvalidCuenta, setMessageCuenta] = useInput({
        typeState: "text", placeholder: "Correo o cuenta", valid: true
    })
    const [contrasena, inputContrasena, , setInvalidContrasena, setMessageContrasena] = useInputPass({
        typeState: "password", placeholder: "Contraseña", valid: true
    })
    const [disabled, setDisabled] = useState(false)
    const onSubmit = async () => {
        if (cuenta === '' || contrasena === '') {
            setInvalidContrasena(contrasena === '')
            setInvalidCuenta(cuenta === '')
            setMessageContrasena(contrasena === '' ? 'Contraseña es requerido' : '')
            setMessageCuenta(cuenta === '' ? 'Correo o cuenta es requerido' : '')
            return
        }
        setDisabled(true)
        try {
            await login(cuenta, contrasena);
            setDisabled(false)
        }
       catch (error){
           setDisabled(false)
           reset();
           setError('afterSubmit', {
               ...error,
               message: error.message || error,
           });
       }
    }


    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{minHeight: '100vh'}}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{minHeight: 'calc(100vh - 68px)'}}>
                        <Grid item sx={{m: {xs: 1, sm: 3}, mb: 0}}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{mb: 3}}>
                                        <Link to="#">
                                            <Logo/>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div style={{paddingBottom: 7}}>
                                            {inputCuenta}
                                        </div>
                                        <div style={{paddingTop: 7}}>
                                            {inputContrasena}
                                        </div>
                                    </Grid>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between"
                                           spacing={1}>
                                        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                                        <Box sx={{mt: 2}}>
                                            <AnimateButton>
                                                <LoadingButton disableElevation loading={disabled} fullWidth size="large"
                                                        type="submit" variant="contained" color="secondary"
                                                        onClick={() => onSubmit()}>
                                                    Iniciar Sesión
                                                </LoadingButton>
                                            </AnimateButton>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{m: 3, mt: 1}}>
                    <AuthFooter/>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
