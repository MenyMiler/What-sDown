import React, { useState } from 'react';
import i18next from 'i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import { RequestStatuses } from '../../interfaces/request';

interface IConfirmationDialogProps {
    isAcceptDialog: boolean;
    open: boolean;
    handleAccept: (status: RequestStatuses) => void;
    handleClose: () => void;
    response: string;
    setResponse: (response: string) => void;
}

export const ConfirmationDialog = (props: IConfirmationDialogProps) => {
    const { isAcceptDialog, open, handleAccept, handleClose, response, setResponse } = props;

    const [errorFlag, setErrorFlag] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResponse(event.target.value);
    };

    const shouldDisplayError = !response && errorFlag;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <DialogContentText>{i18next.t(`requests.${isAcceptDialog ? 'acceptMSG' : 'cancelMSG'}`)}</DialogContentText>
                {!isAcceptDialog && (
                    <TextField
                        label={i18next.t(`requests.${isAcceptDialog ? 'acceptResponse' : 'rejectResponse'}`)}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mt: 2 }}
                        required
                        error={shouldDisplayError}
                        helperText={shouldDisplayError && i18next.t('yupErrorMsg.required')}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{i18next.t('courseDetailsModal.cancel')}</Button>
                <Button
                    onClick={() => {
                        if (!isAcceptDialog && !response) {
                            setErrorFlag(true);
                            return;
                        }
                        handleAccept(isAcceptDialog ? RequestStatuses.DONE : RequestStatuses.CANCELLED);
                    }}
                >
                    {i18next.t('courseDetailsModal.accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
