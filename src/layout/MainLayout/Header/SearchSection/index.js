import {useEffect, useState} from 'react';

// material-ui
import {  styled } from '@mui/material/styles';
import {Avatar, Box,  OutlinedInput, Popper, Typography} from '@mui/material';

// third-party
import PopupState from 'material-ui-popup-state';

// project imports

// assets
import { shouldForwardProp } from '@mui/system';
import Clock from "../../../../views/components/Clock";
import {useAuthContext} from "../../../../auth/useAuthContext";
import LogoSection from "../../LogoSection";




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
          {() => (
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
