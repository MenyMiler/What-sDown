import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { ActionTypes, ActivityTypes } from '../../interfaces/activityLogs';
import LogDataRenderer from './logRerender';

const DialogComponent = ({
    open,
    onClose,
    rowData,
    type,
    actionType,
}: {
    open: boolean;
    onClose: () => void;
    rowData: Record<string, unknown> | null;
    type: ActivityTypes | null;
    actionType: ActionTypes | null;
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#F7F8FE', fontWeight: 'bold', textAlign: 'center' }}>
                {i18next.t('activityLogs.metaData.moreInfoTitle')}
            </DialogTitle>
            <DialogContent dividers sx={{ padding: 3, backgroundColor: '#F7F8FE' }}>
                <LogDataRenderer data={rowData} actionType={actionType} type={type} /> {/* Render log data */}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2, backgroundColor: '#F7F8FE' }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    {i18next.t('activityLogs.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogComponent;
