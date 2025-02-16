import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import i18next from 'i18next';
import { Grid, Typography } from '@mui/material';
import { RequestDocument } from '../../interfaces/request';

const styledStatusColors = {
    DONE: '#2BCC2B',
    CANCELLED: '#FF2800',
    PENDING: '#707070',
};

interface ISingleRequestProps {
    request: RequestDocument;
}

const SingleRequest = ({ request }: ISingleRequestProps) => (
    <Grid
        key={uuidv4()}
        container
        item
        direction="row"
        justifyContent="space-between"
        sx={{
            my: 0.75,
            width: '90%',
            border: '1px solid #E7E8ff',
            borderRadius: '10px',
            ':hover': { opacity: '0.8' },
            p: 1,
            boxShadow: '0px 3px 15px #00000012',
        }}
        alignItems="center"
    >
        <Grid container item direction="column" xs={3} justifyContent="center" display="flex" sx={{ ml: '1rem' }}>
            <Grid item>
                <Typography sx={{ fontWeight: 'bold' }}> {i18next.t(`requestDetailsModal.types.${request.type}`)}</Typography>
            </Grid>
            <Grid item>
                <Typography sx={{ fontSize: '0.9rem' }}>{new Date(request.createdAt).toLocaleDateString()}</Typography>
            </Grid>
        </Grid>
        <Grid item xs={3} justifyContent="center" display="flex" sx={{ color: `${styledStatusColors[request.status]}` }}>
            <Typography sx={{ fontSize: '1rem' }}>{i18next.t(`myRequests.statues.${request.status}`)}</Typography>
        </Grid>
    </Grid>
);

export default SingleRequest;
