import { useSelector } from 'react-redux';
import logo from 'assets/images/logo.svg';
import logoWhite from 'assets/images/logo-white.svg';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const navType = useSelector((state) => state.customization.navType);

  return (
    <img src={navType === 'dark' ? logoWhite : logo} alt="Logo" width="100" />
  );
};

export default Logo;
