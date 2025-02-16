import React, { useState } from 'react';
import i18next from 'i18next';
import { Typography, Grid, Card } from '@mui/material';
import BasicModal from './BasicModal';

interface singleRequestProps {
    request: any;
    changeRequestStatus: Function;
}

const SingleRequest = ({ request, changeRequestStatus }: singleRequestProps) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCancel = async () => {
        setTimeout(() => setOpenDialog(false), 1);
        changeRequestStatus(request._id, 'CANCELLED');
    };

    const handleConfirm = async () => {
        setTimeout(() => setOpenDialog(false), 1);
        changeRequestStatus(request._id, 'DONE');
    };

    return (
        <>
            <BasicModal
                request={request}
                open={openDialog}
                handleClose={handleCloseDialog}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
            />
            <Card
                sx={{ marginTop: '0.5rem', width: '94%', p: '0.5rem', borderRadius: '0.625rem', cursor: 'pointer', ':hover': { opacity: '0.7' } }}
                onClick={() => {
                    setOpenDialog(true);
                }}
            >
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography sx={{ fontWeight: 'bold' }}> {i18next.t(`requestDetailsModal.types.${request.type}`)}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={{ fontSize: '0.9rem' }}>{request.user.name}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
};

export default SingleRequest;
