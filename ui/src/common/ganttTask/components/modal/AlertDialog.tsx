import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import i18next from 'i18next';
import React from 'react';

interface alertDialogProps {
    courseName: string;
    open: boolean;
    handleClose: () => any;
    handleSendRequest: () => any;
}

const AlertDialog = ({ open, handleClose, handleSendRequest, courseName }: alertDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {i18next.t('courseDetailsModal.deleteCourseMsg')}
                    {`${courseName} ?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{i18next.t('courseDetailsModal.cancel')}</Button>
                <Button onClick={handleSendRequest}>{i18next.t('courseDetailsModal.accept')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
