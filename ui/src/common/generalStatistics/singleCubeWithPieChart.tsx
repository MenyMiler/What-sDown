import { Box, CircularProgress, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { environment } from '../../globals';
import { RoomTypes } from '../../interfaces/room';
import { RoomsService } from '../../services/rooms';
import Piechart from '../Piecharts/Piechart';

interface SingleCubeWithPieChartProps {
    type: RoomTypes;
}

const { colors } = environment;
const { piecharts } = colors;

const SingleCubeWithPieChart = ({ type }: SingleCubeWithPieChartProps) => {
    const queryClient = useQueryClient();

    const { data: capacity, isError } = useQuery({
        queryKey: ['capacity', type],
        queryFn: async () => RoomsService.getFreeRoomsCount({ type }),
        meta: {
            errorMessage: `${i18next.t('piechart.error')} ${i18next.t(`piechart.${type}`)} ${i18next.t('piechart.available', {
                context: type,
            })} ${i18next.t('piechart.inArray')}`,
        },
        initialData: { free: 0, overall: -1 },
    });

    useEffect(() => {
        if (isError) queryClient.setQueryData(['capacity', type], { free: 0, overall: 0 });
    }, [isError]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: `${piecharts[`${type}Gradient` as keyof typeof piecharts]}`,
                padding: '1rem',
                borderRadius: '10%',
                maxWidth: '14rem',
                width: '14rem',
            }}
        >
            <Typography sx={{ width: '7rem', color: 'white' }}>{i18next.t(`SingleCubeWithPieChart.${type}`)}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '4rem', alignItems: 'baseline' }}>
                {capacity.overall === -1 ? (
                    <CircularProgress sx={{ color: colors[type].secondary, mt: '1rem' }} />
                ) : (
                    <Typography sx={{ ontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>
                        {capacity.overall - capacity.free}/{capacity.overall === -1 ? '0' : `${capacity.overall}`}
                    </Typography>
                )}
                <Box sx={{ width: '4rem' }}>
                    <Piechart free={capacity.free} overall={capacity.overall} color="#FFFFFF" backgroundColor={colors[type].secondary} />
                </Box>
            </Box>
        </Box>
    );
};

export default SingleCubeWithPieChart;
