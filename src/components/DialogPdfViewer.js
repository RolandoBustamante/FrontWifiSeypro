import React, {useEffect, useState} from 'react';
import {Dialog, CircularProgress, DialogContent, DialogTitle, Grid, Button, IconButton} from '@mui/material';
import PropTypes from "prop-types";
import {HOST_API_KEY} from "../config-global";
import Ventas from "../Models/Ventas";
import Toast from "../utils/toastUtil";
import useInput from "../customHooks/useInput";
import {Icon} from "@iconify/react";
import { lazy, Suspense } from 'react';

const VisorPDFWrapper = lazy(() => import('components/VisorPDFWrapper'));

const DialogPdfViewer = ({open, onClose, url}) => {

    const [pdfUrl, setPdfUrl] = useState(null);
    const [inputWhatsapp, renderWhatsappInput] = useInput({
        typeState: 'text',
        placeholder: 'Enviar comprobante a WhatsApp'
    });

    const enviarWhatsapp = async () => {
        const numero = inputWhatsapp.trim();
        if (!numero) return Toast.Error('Ingrese número');

        Toast.Waiting('Enviando comprobante');
        const {data} = await Ventas.enviarComprobante(url, numero);
        const {enviarComprobante} = data;
        Toast.Remove();
        if (enviarComprobante.success) Toast.Success('Mensaje Enviado');
    };

    useEffect(() => {
        if (!open || !url || typeof url !== 'string') return;

        const fetchPdf = async () => {
            try {
                const response = await fetch(`${HOST_API_KEY}/${url}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                if (!response.ok) throw new Error('Error al obtener el PDF');
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setPdfUrl(objectUrl);
            } catch (err) {
                console.error('Error al cargar PDF:', err);
                setPdfUrl(null);
            }
        };

        fetchPdf();

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [open, url]);

    return (
        <Dialog open={open} fullWidth>
            <DialogTitle sx={{position: 'relative', pb: 1.5}}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={4}>{renderWhatsappInput}</Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            startIcon={<Icon icon="mdi:whatsapp" />}
                            onClick={enviarWhatsapp}
                        >
                            Enviar
                        </Button>
                    </Grid>
                </Grid>
                <IconButton onClick={onClose} sx={{position: 'absolute', right: 8, top: 8}}>
                    <Icon icon="mdi:close" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {open && typeof pdfUrl === 'string' ? (
                    <div style={{height: '100%', border: '1px solid #ccc'}}>
                        <Suspense fallback={<div>Cargando visor PDF...</div>}>
                            <VisorPDFWrapper fileUrl={pdfUrl} />
                        </Suspense>
                    </div>
                ) : (
                    <div style={{padding: '2rem', textAlign: 'center'}}>
                        <CircularProgress />
                        <p>Cargando PDF...</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

DialogPdfViewer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
};

export default DialogPdfViewer;
