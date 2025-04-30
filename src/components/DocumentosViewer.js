import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Tooltip,
    Box,
} from '@mui/material';
import { NavigateBeforeRounded, NavigateNextRounded, Close } from '@mui/icons-material';

const DocumentViewer = ({ documentos, config, setConfig }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNavigation = (direction) => {
        setCurrentIndex((prev) => prev + direction);
    };

    const { nombre, url } = documentos[currentIndex] || {};
    const onClose= ()=>{
        setConfig(false)
    }

    return (
        <Dialog
            open={config}
            onClose={onClose}
            fullWidth
            PaperProps={{
                style: { borderRadius: 8, overflow: 'hidden' },
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{nombre}</Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {url ? (
                    <>
                        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                        <iframe
                            src={`https://drive.google.com/file/d/${url}/preview`}
                            style={{
                                border: 'none',
                                width: '100%',
                                height: '480px',
                            }}
                            allow="autoplay"
                        />
                        <Box mt={2} textAlign="center">
                            <a
                                href={`https://drive.google.com/uc?id=${url}&export=download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'blue' }}
                            >
                                Descargar archivo
                            </a>
                        </Box>
                    </>
                ) : (
                    <Typography color="textSecondary">No hay contenido disponible.</Typography>
                )}
                {documentos.length > 1 && (
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Tooltip title="Anterior">
              <span>
                <IconButton
                    onClick={() => handleNavigation(-1)}
                    disabled={currentIndex === 0}
                    color="primary"
                >
                  <NavigateBeforeRounded />
                </IconButton>
              </span>
                        </Tooltip>
                        <Typography>{`${currentIndex + 1} / ${documentos.length}`}</Typography>
                        <Tooltip title="Siguiente">
              <span>
                <IconButton
                    onClick={() => handleNavigation(1)}
                    disabled={currentIndex === documentos.length - 1}
                    color="primary"
                >
                  <NavigateNextRounded />
                </IconButton>
              </span>
                        </Tooltip>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

DocumentViewer.propTypes = {
    documentos: PropTypes.arrayOf(
        PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
    config: PropTypes.bool.isRequired,
    setConfig: PropTypes.func,
};

export default DocumentViewer;
