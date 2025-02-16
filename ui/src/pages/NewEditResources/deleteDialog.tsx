import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import i18next from 'i18next';
import React from 'react';
import { RoomWithCapacity } from '../../interfaces/room';

interface DeleteDialogProps {
    open: boolean;
    handleClose: () => any;
    handleRemoveSelectedResource: (resource: RoomWithCapacity) => any;
    resource: RoomWithCapacity;
}

const DeleteDialog = ({ open, handleClose, handleRemoveSelectedResource, resource }: DeleteDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0' }}>
                <Typography variant="h6" align="left" sx={{ flex: 1 }}>
                    {i18next.t('newEditResourcesPage.deleteDialog.title')}
                </Typography>
                <IconButton onClick={handleClose} edge="start" size="small" sx={{ marginRight: '-8px' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'start', padding: '1.5rem' }}>
                <Typography variant="body1">{i18next.t('newEditResourcesPage.deleteDialog.body')}</Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'end', padding: '1rem' }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        borderColor: '#c4c4c4',
                        color: 'black',
                        textTransform: 'none',
                        padding: '0.5rem 2rem',
                        borderRadius: '1rem',
                    }}
                >
                    {i18next.t('newEditResourcesPage.deleteDialog.cancelBtn')}
                </Button>
                <Button
                    onClick={() => handleRemoveSelectedResource(resource)}
                    variant="contained"
                    color="error"
                    sx={{
                        borderColor: '#c4c4c4',
                        bgcolor: '#ebcccf',
                        color: 'red',
                        marginLeft: '1rem',
                        padding: '0.5rem 2rem',
                        borderRadius: '1rem',
                        boxShadow: 'none',
                    }}
                >
                    {i18next.t('newEditResourcesPage.deleteDialog.deleteBtn')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
