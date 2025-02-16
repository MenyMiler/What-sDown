import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { Typography, Grid, Card, Box } from '@mui/material';
import BasicModal from './BasicModal';
import { PopulatedRequest } from '../../interfaces/request';

interface singleRequestProps {
    request: PopulatedRequest;
}

const statusColorLegend = {
    DONE: '#4CAF50',
    CANCELLED: '#F5303D',
    PENDING: '#FF9800',
};

const MySingleRequest = ({ request }: singleRequestProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [statusColor, _setStatusColor] = useState(statusColorLegend[request.status] || '#000000');

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <BasicModal request={request} open={openDialog} handleClose={handleCloseDialog} />
            <Card
                sx={{ marginTop: '0.5rem', width: '94%', px: '0.5rem', py: '1rem', borderRadius: '0.625rem' }}
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
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Box sx={{ bgcolor: 'white', borderRadius: '0.7rem', border: `2.2px solid ${statusColor}` }}>
                            <Typography sx={{ px: '0.4rem', py: '0.1rem', color: statusColor }}>{i18next.t(`requests.${request.status}`)}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
};

export default MySingleRequest;
