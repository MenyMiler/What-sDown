/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Box, Typography } from '@mui/material';
import { People, Assignment } from '@mui/icons-material';
import i18next from 'i18next';
import { IconCircle } from '../generalStatistics/singleCube.styled';
import { environment } from '../../globals';

interface statisticElementProps {
    statistic: number;
    type: 'courses' | 'soldiers';
}

const { colors } = environment;

const StatisticElement = ({ statistic, type }: statisticElementProps) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '1rem' }}>
            <Typography sx={{ mr: '5rem' }}>{i18next.t(`statisticElement.${type}`)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: '0.5rem', fontWeight: 'bold', fontSize: '2rem' }}>{statistic}</Typography>
                {type === 'soldiers' ? (
                    <IconCircle sx={{ background: colors.backgroundColorStatisticElement[type] }}>
                        <People sx={{ width: '2.5rem', height: '2.5rem' }} />
                    </IconCircle>
                ) : (
                    <IconCircle sx={{ background: colors.backgroundColorStatisticElement[type] }}>
                        <Assignment sx={{ width: '2.5rem', height: '2.5rem' }} />
                    </IconCircle>
                )}
            </Box>
        </Box>
    );
};

export default StatisticElement;
