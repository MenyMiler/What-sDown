import React from 'react';
import { AccessTime, CheckCircle, Cancel } from '@mui/icons-material';
import { Typography } from '@mui/material';
import i18next from 'i18next';
import { RequestStatuses } from '../../interfaces/request';

interface IStatus {
    status: RequestStatuses;
}

export const Status = ({ status }: IStatus) => {
    const getStatusColor = () => {
        switch (status) {
            case RequestStatuses.CANCELLED:
                return '#d94040';
            case RequestStatuses.PENDING:
                return '#ffa500';
            case RequestStatuses.DONE:
                return '#599a3f';
            default:
                return '#000';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case RequestStatuses.CANCELLED:
                return <Cancel fontSize="large" />;
            case RequestStatuses.PENDING:
                return <AccessTime fontSize="large" />;
            case RequestStatuses.DONE:
                return <CheckCircle fontSize="large" />;
            default:
                return <AccessTime fontSize="large" />;
        }
    };

    return (
        <Typography
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: getStatusColor(),
                fontWeight: 'bold',
                fontSize: '1.2rem',
                gap: '0.5rem',
            }}
        >
            {getStatusIcon()}
            {i18next.t(`requests.${status}`)}
        </Typography>
    );
};
