import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper, Typography} from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import Clock from "../../../../views/components/Clock";
import {useAuthContext} from "../../../../auth/useAuthContext";
import LogoSection from "../../LogoSection";

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: '99%',
  top: '-55px !important',
  padding: '0 12px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px'
  }
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: 434,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff'
  }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ()  => {
  return (
      <LogoSection/>
  );
}


// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const {sesion} = useAuthContext();
  const [sedeActual, setSedeActual]= useState({})
  useEffect(()=>{
    if(sesion){
      setSedeActual(sesion.sedes.find(element=>element.id===sesion.sede_seleccionada))
    }
  },[sesion])
  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <LogoSection/>
              </Box>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h5">
            Usuario:{sesion.nombres??''},
            Sede actual: {sedeActual.nombre ?? ''}
          </Typography>
          <Box
              sx={{
                paddingLeft: 5,marginLeft:5,
              }}
          >
            <Clock />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SearchSection;
