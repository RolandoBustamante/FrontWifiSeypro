import {useDispatch, useSelector} from 'react-redux';
import {Outlet} from 'react-router-dom';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {AppBar, Box, CssBaseline, Toolbar, useMediaQuery} from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import navigation from 'menu-items';
import {drawerWidth} from 'store/constant';
import {SET_MENU} from 'store/actions';

// assets
import {IconChevronRight} from '@tabler/icons';
import PropTypes from 'prop-types';
import {useAuthContext} from "../../auth/useAuthContext";
import {useCallback, useEffect, useState} from "react";
import {filtrarMenuConAccesos} from "../../utils/utils";
import Ventas from "../../Models/Ventas";
import PendientesCobroDialog from "../../components/PendientesCobroDialog";


// styles
const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxWidth: '100%',
    minWidth: 0,
    overflowX: 'hidden',
    transition: theme.transitions.create(
        'margin',
        open
            ? {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }
            : {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }
    ),
    width: open ? '100%' : `calc(100% - ${drawerWidth}px)`,
    marginLeft: open ? 0 : -(drawerWidth - 20),
    [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        marginRight: '10px',
        padding: '16px'
    }
}));


// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({viewHeader = false}) => {
    MainLayout.propTypes = {
        viewHeader: PropTypes.bool
    }
    const [navegacion, setNavegacion] = useState(navigation)
    const {sesion} = useAuthContext();
    useEffect(() => {
        if (sesion?.rol?.id === 'd10503e9-847b-48d6-a9ff-a0f182974300')
            setNavegacion(navigation)
        else setNavegacion({items: filtrarMenuConAccesos(navigation.items, sesion?.rol?.accesos)})


    }, [sesion])

    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const [pendientes, setPendientes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const PENDIENTES_DIALOG_KEY = 'pendientesCobroDialogAt';
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    const isRepartidor = Boolean(sesion?.rol?.es_repartidor);

    const parseDetallesJson = (detallesJson) => {
        if (!detallesJson) return {items: [], mostrar: false};
        if (typeof detallesJson === 'string') {
            try {
                return JSON.parse(detallesJson);
            } catch {
                return {items: [], mostrar: false};
            }
        }
        return detallesJson;
    };

    const fetchPendientes = useCallback(async () => {
        try {
            const res = await Ventas.listarMovimientosPendientes('');
            const detallesJson = res?.data?.listarMovimientosPendientes?.detallesJson;
            const parsed = parseDetallesJson(detallesJson);
            const items = Array.isArray(parsed?.items) ? parsed.items : [];
            const mostrar = Boolean(parsed?.mostrar);
            setPendientes(items);

            if (mostrar && items.length > 0) {
                const lastShown = Number(localStorage.getItem(PENDIENTES_DIALOG_KEY) || 0);
                const now = Date.now();
                if (now - lastShown >= SIX_HOURS_MS) {
                    setDialogOpen(true);
                    localStorage.setItem(PENDIENTES_DIALOG_KEY, String(now));
                }
            }
        } catch (e) {
            // silent
        }
    }, []);

    useEffect(() => {
        if (!sesion) return;
        if (isRepartidor) {
            setPendientes([]);
            setDialogOpen(false);
            return;
        }
        fetchPendientes().then(r => r);
        const id = setInterval(() => {
            fetchPendientes().then(r => r);
        }, SIX_HOURS_MS);
        return () => clearInterval(id);
    }, [fetchPendientes, sesion, isRepartidor]);
    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        dispatch({type: SET_MENU, opened: !leftDrawerOpened});
    };

    return (
        <Box sx={{display: 'flex', width: '100%', minWidth: 0, overflowX: 'hidden'}}>
            <CssBaseline/>
            {/* header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>
                    <Header
                        handleLeftDrawerToggle={handleLeftDrawerToggle}
                        pendingCount={isRepartidor ? 0 : pendientes.length}
                        onOpenPendingDialog={isRepartidor ? undefined : () => setDialogOpen(true)}
                    />
                </Toolbar>
            </AppBar>

            {/* drawer */}
            <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
                     drawerToggle={handleLeftDrawerToggle}/>

            {/* main content */}
            <Main theme={theme} open={leftDrawerOpened}>
                {/* breadcrumb */}
                {viewHeader &&
                    <Breadcrumbs separator={IconChevronRight} navigation={navegacion} icon title rightAlign/>}
                <Outlet/>
            </Main>
            {!isRepartidor && (
                <PendientesCobroDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    items={pendientes}
                />
            )}
            <Customization/>
        </Box>
    );
};

export default MainLayout;
