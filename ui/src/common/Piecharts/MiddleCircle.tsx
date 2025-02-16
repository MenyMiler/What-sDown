import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import i18next from 'i18next';

interface IMiddleCircleProps {
    gradient: string;
    overall: number;
    loadingCircleColor: string;
}

const MiddleCircle = (props: IMiddleCircleProps) => {
    const { gradient, overall, loadingCircleColor } = props;

    return (
        <Box
            sx={{
                position: 'absolute',
                width: '8.5rem',
                height: '8.5rem',
                borderRadius: '50%',
                background: gradient,
                mb: '0.4rem',
            }}
        >
            <Box sx={{ textAlign: 'center', mt: '2rem' }}>
                <Typography variant="h6" color="white">
                    {i18next.t('piechart.overall')}
                </Typography>
                {overall === -1 ? (
                    <CircularProgress sx={{ color: loadingCircleColor, mt: '0.5rem' }} />
                ) : (
                    <Typography variant="h4" color="white">
                        {overall}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default MiddleCircle;
