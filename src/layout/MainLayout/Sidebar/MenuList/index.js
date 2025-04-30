// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import {useAuthContext} from "../../../../auth/useAuthContext";
import navigation from "../../../../menu-items";
import {filtrarMenuConAccesos} from "../../../../utils/utils";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const { sesion } = useAuthContext();
  let items= menuItem.items
  if (sesion?.rol?.id === 'd10503e9-847b-48d6-a9ff-a0f182974300')
    items= menuItem.items
  else items= filtrarMenuConAccesos(navigation.items, sesion?.rol?.accesos)


  const navItems = items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
