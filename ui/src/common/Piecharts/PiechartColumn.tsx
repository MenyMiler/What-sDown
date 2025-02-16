import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { environment } from '../../globals';
import Piechart from './Piechart';
import Legend from '../Legend';
import MiddleCircle from './MiddleCircle';
import { RoomsService } from '../../services/rooms';
import { RoomTypes } from '../../interfaces/room';
import { useUserStore } from '../../stores/user';

interface IPiechartColumnProps {
    type: RoomTypes;
}
export interface IPieData {
    free: number;
    overall: number;
}

const { colors } = environment;
const { piecharts } = colors;

const PiechartColumn = (props: IPiechartColumnProps) => {
    const { type } = props;
    const currentUser = useUserStore(({ user }) => user);

    const queryClient = useQueryClient();

    const { data, isError } = useQuery({
        queryKey: ['capacity', type, currentUser.baseId],
        queryFn: async () => RoomsService.getFreeRoomsCount({ baseId: currentUser.baseId, type }),
        meta: {
            errorMessage: `${i18next.t('piechart.error')} ${i18next.t(`piechart.${type}`)} ${i18next.t('piechart.available', {
                context: type,
            })} ${i18next.t('piechart.inBase')}`,
        },
        initialData: { free: 0, overall: -1 },
    });

    useEffect(() => {
        if (isError) queryClient.setQueryData(['capacity', type, currentUser.baseId], { free: 0, overall: 0 });
    }, [isError]);

    useEffect(() => {
        queryClient.setQueryData(['capacity', type, currentUser.baseId], { free: 0, overall: -1 });
    }, [currentUser.baseId]);

    return (
        <Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography fontSize="1.2rem">
                    {i18next.t('piechart.status')} {i18next.t(`piechart.${type}`)} {i18next.t('piechart.inBase')}
                </Typography>
                <Typography variant="subtitle1" color="#707070">
                    {data.free}/{data.overall === -1 ? '0' : `${data.overall}`} {i18next.t('piechart.available', { context: type })}
                </Typography>
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    my: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <MiddleCircle
                    gradient={`${piecharts[`${type}Gradient` as keyof typeof piecharts]}`}
                    overall={data.overall}
                    loadingCircleColor={colors[type].secondary}
                />
                <Piechart free={data.free} overall={data.overall} color={colors[type].primary} backgroundColor={colors[type].secondary} />
            </Box>
            <Legend
                items={[
                    { dotColor: `${type}.secondary`, text: `${i18next.t('piechart.available')}` },
                    { dotColor: `${type}.primary`, text: `${i18next.t('piechart.unavailable')}` },
                ]}
                sx={{ display: 'flex', justifyContent: 'space-evenly' }}
                spacing="space-evenly"
            />
        </Box>
    );
};

export default PiechartColumn;
