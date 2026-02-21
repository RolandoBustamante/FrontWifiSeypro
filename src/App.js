import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes'
import { AuthProvider } from './auth/JwtContext';


// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import {ToastContainer} from 'react-toastify';
import LandscapeGuard from 'components/LandscapeGuard';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
        <ToastContainer/>
        <AuthProvider>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <LandscapeGuard />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </AuthProvider>
    </StyledEngineProvider>
  );
};

export default App;
