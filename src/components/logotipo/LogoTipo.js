import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Link } from '@mui/material';
import logo from 'assets/images/logo.svg';
import logoWhite from 'assets/images/logo-white.svg';

// ----------------------------------------------------------------------

const Logotipo = forwardRef(({ disabledLink = false, sx }) => {
    const navType = useSelector((state) => state.customization.navType);

    const logotype = (
        <Box
            component="img"
            src={navType === 'dark' ? logoWhite : logo}
            sx={{ width: '15rem', cursor: 'pointer', ...sx }}
        />
    );

    if (disabledLink) {
        return logotype;
    }

    return (
        <Box>
            <Link component={RouterLink} to="/" sx={{ display: 'contents' }}>
                {logotype}
            </Link>
        </Box>
    );
});

Logotipo.propTypes = {
    sx: PropTypes.object,
    disabledLink: PropTypes.bool,
};

export default Logotipo;
