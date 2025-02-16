/* eslint-disable react/require-default-props */
import { Divider, Card } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { useQueries } from '@tanstack/react-query';
import StatisticElement from './statisticElement';
import { CoursesService } from '../../services/courses';
import { SoldiersService } from '../../services/soldiers';
import { useUserStore } from '../../stores/user';

const StatisticsBlock = () => {
    const currentUser = useUserStore(({ user }) => user);

    const [{ data: activeCoursesStatistic = 0 }, { data: statusSoldiersStatistic = 0 }] = useQueries({
        queries: [
            {
                queryKey: ['courses', 'currentAmount', currentUser.baseId],
                queryFn: () => CoursesService.getCurrentAmount(currentUser.baseId),
                meta: { errorMessage: i18next.t('statisticElement.errors.courses') },
            },
            {
                queryKey: ['soldiers', 'currentAmount', currentUser.baseId],
                queryFn: () => SoldiersService.getCurrentAmount(currentUser.baseId),
                meta: { errorMessage: i18next.t('statisticElement.errors.soldiers') },
            },
        ],
    });

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '0.625rem', justifyContent: 'space-evenly', height: '100%' }}>
            <StatisticElement statistic={statusSoldiersStatistic} type="soldiers" />
            <Divider />
            <StatisticElement statistic={activeCoursesStatistic} type="courses" />
        </Card>
    );
};

export default StatisticsBlock;
