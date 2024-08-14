import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const useMyDialog = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [confirmButtonLabel, setConfirmButtonLabel] = useState('Confirmar');
    const [cancelButtonLabel, setCancelButtonLabel] = useState('Cancelar');

    const openDialog = (title, content, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar') => {
        setDialogTitle(title);
        setDialogContent(content);
        setConfirmButtonLabel(confirmLabel);
        setCancelButtonLabel(cancelLabel);
        setShowDialog(true);

        return new Promise((resolve, reject) => {
            const handleAccept = () => {
                setShowDialog(false);
                resolve(true);
            };

            const handleCancel = () => {
                setShowDialog(false);
                resolve(false);
            };
            window.handleAccept = handleAccept;
            window.handleCancel = handleCancel;
        });
    };

    const MyDialog = () => (
        <Dialog open={showDialog} onClose={window.handleCancel}>
            <DialogTitle>
                <WarningIcon sx={{ marginRight: '8px', color: 'yellow' }} />
                {dialogTitle}
            </DialogTitle>
            <DialogContent>{dialogContent}</DialogContent>
            <DialogActions>
                <Button onClick={window.handleCancel} color="error">
                    {cancelButtonLabel}
                </Button>
                <Button onClick={window.handleAccept} color="primary">
                    {confirmButtonLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return {
        openDialog,
        MyDialog,
    };
};

export default useMyDialog;
