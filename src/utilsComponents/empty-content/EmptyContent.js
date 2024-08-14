import PropTypes from 'prop-types';
// @mui
import { Typography, Stack } from '@mui/material';


EmptyContent.propTypes = {
  sx: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default function EmptyContent({ title, description, img, sx, ...other }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 0,
        textAlign: 'center',
        p: (theme) => theme.spacing(4, 2),
        ...sx,
      }}
      {...other}
    >

      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </Stack>
  );
}
