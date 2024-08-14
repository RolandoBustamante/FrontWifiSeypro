import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logotipo = forwardRef(({ disabledLink = false, sx}) => {
    const logotype = (
        <Box
            component="img"
            src="images/logo.svg"
            sx={{ width: '15rem', cursor: 'pointer', ...sx }}
        />
    )
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
