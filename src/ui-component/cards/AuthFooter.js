// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://www.linkedin.com/in/edwin-rolando-bustamante-ruiz-20575a193/" target="_blank" underline="hover">
      Edwin Rolando Bustamante Ruiz
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://seypro.com.pe/" target="_blank" underline="hover">
      &copy; Seypro
    </Typography>
  </Stack>
);

export default AuthFooter;
