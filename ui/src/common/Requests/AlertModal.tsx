import React from 'react';
import i18next from 'i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';

interface alertModalProps {
    status: string;
    open: boolean;
    handleClose: () => any;
    handleSendRequest: () => any;
}

const AlertModal = ({ open, handleClose, handleSendRequest, status }: alertModalProps) => {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {status === 'CANCELLED' ? i18next.t('requests.cancelMSG') : i18next.t('requests.acceptMSG')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{i18next.t('courseDetailsModal.cancel')}</Button>
                <Button onClick={handleSendRequest}>{i18next.t('courseDetailsModal.accept')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertModal;
