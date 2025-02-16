/* eslint-disable react/require-default-props */
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material';
import i18next from 'i18next';
import React, { MouseEventHandler } from 'react';

interface IAreYouSureDialogProps {
    open: boolean;
    handleClose: () => void;
    title?: string;
    isLoading?: boolean;
    onYes: MouseEventHandler;
    onNo?: MouseEventHandler;
}

export const AreYouSureDialog = ({
    open,
    handleClose,
    title = i18next.t('areYouSureDialog.title'),
    isLoading = false,
    onYes,
    onNo,
}: IAreYouSureDialogProps) => (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogActions>
            <Button onClick={onNo ?? handleClose}>{i18next.t('areYouSureDialog.no')}</Button>
            <Button onClick={onYes} autoFocus disabled={isLoading}>
                {i18next.t('areYouSureDialog.yes')}
                {isLoading && <CircularProgress size={20} />}
            </Button>
        </DialogActions>
    </Dialog>
);
