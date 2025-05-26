// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://m2m.seypro.net.pe/" target="_blank" underline="hover">
        SEYPRO SISTEMA DE REDES INALAMBRICAS S.A.C.
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://seypro.com.pe/" target="_blank" underline="hover">
      &copy; Seypro
    </Typography>
  </Stack>
);

export default AuthFooter;
