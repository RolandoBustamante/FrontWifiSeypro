import PropTypes from 'prop-types';
import {forwardRef} from 'react';
// @mui
import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/material';

//
import {StyledLabel} from './styles';

// ----------------------------------------------------------------------
/**
 * Aclara un color hexadecimal.
 * @param {string} hexColor - El color en formato hexadecimal (por ejemplo, #8f2ebd).
 * @param {number} percent - El porcentaje a aclarar (por ejemplo, 0.1 para aclarar un 10%).
 * @returns {string} - El nuevo color hexadecimal aclarado.
 */
const lightenHexColor = (hexColor, percent=0.1) => {
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const Label = forwardRef(
    ({children, color = 'default', variant = 'soft', startIcon, endIcon, sx, ...other}, ref) => {
        const theme = useTheme();
        const iconStyle = {
            width: 16,
            height: 16,
            '& svg, img': {width: 1, height: 1, objectFit: 'cover'},
        };


        // Verifica si el color es uno de los predefinidos o un código de color
        const isCustomColor = /^#([0-9A-F]{3}){1,2}$/i.test(color) || /^(rgb|hsl)a?\(/i.test(color) || /^[a-z]+$/i.test(color);

        const backgroundColor = isCustomColor ? lightenHexColor(color, 0.7) : theme.palette[color]?.main || theme.palette.default.main;

        return (
            <StyledLabel
                ref={ref}
                component="span"
                ownerState={{color, variant}}

                sx={{
                    backgroundColor,
                    color: /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : null,
                    ...(startIcon && {pl: 0.75}),
                    ...(endIcon && {pr: 0.75}),
                    ...sx,
                }}
                theme={theme}
                {...other}
            >
                {startIcon && <Box sx={{mr: 0.75, ...iconStyle}}> {startIcon} </Box>}

                {children}

                {endIcon && <Box sx={{ml: 0.75, ...iconStyle}}> {endIcon} </Box>}
            </StyledLabel>
        );
    }
);

Label.propTypes = {
    sx: PropTypes.object,
    endIcon: PropTypes.node,
    children: PropTypes.node,
    startIcon: PropTypes.node,
    variant: PropTypes.oneOf(['filled', 'outlined', 'ghost', 'soft']),
    color: PropTypes.oneOfType([
        PropTypes.oneOf([
            'default',
            'primary',
            'secondary',
            'info',
            'success',
            'warning',
            'error',
        ]),
        PropTypes.string, // Permite que color sea un string para los códigos de color personalizados
    ]),
};

export default Label;
