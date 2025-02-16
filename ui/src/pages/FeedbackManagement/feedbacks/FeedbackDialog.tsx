import React from 'react';
import { Close } from '@mui/icons-material';
import { Box, Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import i18next from 'i18next';
import { PopulatedFeedback } from '../../../interfaces/feedback';
import { FeedbackDialogContent } from './FeedbackDialogContent';

interface IFeedbackDialogProps {
    populatedFeedback: PopulatedFeedback;
    open: boolean;
    handleClose: (feedbackId: string) => void;
}

export const FeedbackDialog = ({ populatedFeedback, open, handleClose }: IFeedbackDialogProps) => {
    return (
        <Dialog onClose={() => handleClose(populatedFeedback._id)} open={open} maxWidth="sm" fullWidth scroll="paper" sx={{ textAlign: 'center' }}>
            <IconButton onClick={() => handleClose(populatedFeedback._id)} sx={{ position: 'absolute', left: 8, top: 8 }}>
                <Close />
            </IconButton>
            <DialogTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>{i18next.t('feedbackManagementPage.feedbackDetails')}</Typography>
                </Box>
            </DialogTitle>
            <FeedbackDialogContent populatedFeedback={populatedFeedback} />
        </Dialog>
    );
};
