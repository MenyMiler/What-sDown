/* eslint-disable react/no-array-index-key */
import { Close } from '@mui/icons-material';
import {
    Box,
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress,
    Typography,
    linearProgressClasses,
    styled,
} from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { customIcons } from '../../../common/Modals/sendFeedback/SendFeedback';
import { IPercentageByRating } from './FeedbacksStatistics';

interface IStatisticsDialogProps {
    percentageByRating: IPercentageByRating[];
    totalAmountOfFeedbacks: number;
    open: boolean;
    handleClose: () => void;
}

const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 15,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        borderRadius: 5,
        backgroundColor: '#FFCC48',
    },
    [`& .${linearProgressClasses.bar}`]: {
        backgroundColor: '#eeeeee',
    },
}));

export const StatisticsDialog = ({ percentageByRating, totalAmountOfFeedbacks, open, handleClose }: IStatisticsDialogProps) => {
    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth scroll="paper" sx={{ textAlign: 'center' }}>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', left: 8, top: 8 }}>
                <Close />
            </IconButton>
            <DialogTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>{i18next.t('feedbackManagementPage.statisticCube.overallSatisfaction')}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Card sx={{ borderRadius: 10, backgroundColor: '#F5F8FF', mb: '1rem', mx: '11rem', py: '0.8rem', fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flex: 'nowrap', gap: 0.5 }}>
                        <Typography fontWeight="bold">
                            {((5 / 100) * percentageByRating.find(({ rating }) => rating === 5)!.percentage).toFixed(1)}
                        </Typography>
                        <Typography>{i18next.t('feedbackManagementPage.statisticCube.from')}</Typography>
                        <Typography fontWeight="bold">{5}</Typography>
                        {customIcons[5].icon}
                    </Box>
                </Card>
                <Box sx={{ display: 'flex', justifyContent: 'center', flex: 'nowrap', mb: '1rem', gap: 0.5 }}>
                    <Typography>{i18next.t('feedbackManagementPage.statisticCube.totalAmountFeedback')}</Typography>
                    <Typography fontWeight="bold">{totalAmountOfFeedbacks}</Typography>
                </Box>
                {percentageByRating
                    .sort((a, b) => b.rating - a.rating)
                    .map(({ rating, count, percentage }, index) => (
                        <Grid
                            key={index}
                            container
                            spacing={2}
                            sx={{ width: '90%', ml: '2.8rem' }}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Grid item>
                                <Typography>{customIcons[rating].icon}</Typography>
                            </Grid>
                            <Grid item>
                                <BorderLinearProgress sx={{ width: '10rem' }} variant="determinate" value={100 - percentage} />
                            </Grid>
                            <Grid item container direction="row" alignItems="center" spacing={0.5} sx={{ width: '25%' }}>
                                <Grid item>
                                    <Typography>{percentage.toFixed(1)}%</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>({count})</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
            </DialogContent>
        </Dialog>
    );
};
