import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';
import PropTypes from 'prop-types';
import {useAuthContext} from "../../auth/useAuthContext";
import {useEffect, useState} from "react";


// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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

const MainLayout = ({viewHeader= false}) => {
    MainLayout.propTypes={
        viewHeader: PropTypes.bool
    }
    const [navegacion, setNavegacion]= useState(navigation)
    const { sesion } = useAuthContext();
    useEffect(()=>{
        if (sesion?.rol?.id !== 'd10503e9-847b-48d6-a9ff-a0f182974300') setNavegacion({items: navigation.items.filter(element=>element.id!=="admin")})
    },[sesion])

    const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
          {viewHeader&& <Breadcrumbs separator={IconChevronRight} navigation={navegacion} icon title rightAlign />}
        <Outlet />
      </Main>
      <Customization />
    </Box>
  );
};

export default MainLayout;
