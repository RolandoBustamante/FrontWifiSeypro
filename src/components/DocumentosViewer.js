import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Tooltip,
    Box, CircularProgress,
} from '@mui/material';
import {NavigateBeforeRounded, NavigateNextRounded, Close, DownloadRounded} from '@mui/icons-material';
import Clientes from "../Models/Clientes";
import {HOST_API_KEY} from "../config-global";

const DocumentViewer = ({documentos, config, setConfig}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fileUrl, setFileUrl] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [load, setLoad] = useState(false)

    const handleNavigation = (direction) => {
        setCurrentIndex((prev) => prev + direction);
    };

    const currentDoc = documentos?.[currentIndex];
    const {nombre, url} = currentDoc || {};

    const onClose = () => {
        setConfig(false);
    };

    const fetchFile = async (url) => {
        try {
            const response = await fetch(`${HOST_API_KEY}/${url}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!response.ok) throw new Error('Error al obtener el archivo');
            const contentType = response.headers.get('Content-Type');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setIsImage(contentType.startsWith('image/'));
            setFileUrl(objectUrl);
        } catch (err) {
            setFileUrl(null);
            setIsImage(false);
        }
    };

    useEffect(() => {
        setCurrentIndex(0);
    }, [documentos]);

    useEffect(() => {
        if (!url) return;
        setLoad(true)
        Clientes.obtenerRecurso(url)
            .then(response => {
                const {label} = response.data.obtenerDrive;
                fetchFile(label);
                setLoad(false)
                return () => {
                    if (fileUrl) URL.revokeObjectURL(fileUrl);
                };
            });
    }, [url]);

    return (
        <Dialog
            open={config}
            onClose={onClose}
            fullWidth
            PaperProps={{
                style: {borderRadius: 8, overflow: 'hidden'},
            }}
        >
            {(!Array.isArray(documentos) || documentos.length === 0) ? (
                <DialogContent>
                    <Typography color="textSecondary">No hay documentos disponibles.</Typography>
                </DialogContent>
            ) : (
                <>
                    <DialogTitle>
                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" noWrap>
                                {nombre}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                {documentos.length > 1 && (
                                    <>
                                        <Tooltip title="Anterior">
            <span>
              <IconButton onClick={() => handleNavigation(-1)} disabled={currentIndex === 0} size="small">
                <NavigateBeforeRounded/>
              </IconButton>
            </span>
                                        </Tooltip>
                                        <Typography>{`${currentIndex + 1}/${documentos.length}`}</Typography>
                                        <Tooltip title="Siguiente">
            <span>
              <IconButton onClick={() => handleNavigation(1)} disabled={currentIndex === documentos.length - 1}
                          size="small">
                <NavigateNextRounded/>
              </IconButton>
            </span>
                                        </Tooltip>
                                    </>
                                )}
                                {isImage && fileUrl && (
                                    <Tooltip title="Descargar imagen">
                                        <IconButton
                                            component="a"
                                            href={fileUrl}
                                            download={nombre}
                                            size="small"
                                        >
                                            <DownloadRounded fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <IconButton onClick={onClose}>
                                    <Close/>
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogTitle>
                    {
                        load && <div style={{padding: '2rem', textAlign: 'center'}}>
                            <CircularProgress/>
                            <p>Cargando...</p>
                        </div>
                    }
                    {!load && <DialogContent style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        {fileUrl ? (
                            isImage ? (
                                <img
                                    src={fileUrl}
                                    alt={nombre}
                                    style={{
                                        width: '100%',
                                        maxHeight: '480px',
                                        objectFit: 'contain',
                                        borderRadius: 4,
                                    }}
                                />


                            ) : (
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                                    <iframe
                                        src={`${fileUrl}#toolbar=1&amp;navpanes=0&amp;scrollbar=0`}
                                        style={{
                                            border: 'none',
                                            width: '90%',
                                            height: '70vh',
                                        }}
                                        allow="autoplay"
                                    />
                                </div>
                            )
                        ) : (
                            <Typography color="textSecondary">Cargando documento...</Typography>
                        )}
                    </DialogContent>
                    }
                </>
            )}
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
