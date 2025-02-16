/* eslint-disable react/require-default-props */
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';
import { customIcons } from '../../../common/Modals/sendFeedback/SendFeedback';
import { IFrequentCategory, IPercentageByRating } from './FeedbacksStatistics';
import { StatisticsDialog } from './StatisticsDialog';

interface IStatisticCubeProps {
    moreDetails?: boolean;
    title: string;
    percentageByRating?: IPercentageByRating[];
    frequentCategory?: IFrequentCategory;
    totalAmountOfFeedbacks: number;
}

export const StatisticCube = ({ moreDetails = false, title, percentageByRating, frequentCategory, totalAmountOfFeedbacks }: IStatisticCubeProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleCloseDialog = () => setOpen(false);

    return (
        <Grid
            item
            container
            direction="column"
            sx={{ width: '18rem', backgroundColor: '#ffffff', minHeight: '10.5rem', borderRadius: 5 }}
            spacing={1}
            alignItems="center"
        >
            <Grid item>
                <Typography fontWeight="bold"> {i18next.t(`feedbackManagementPage.statisticCube.${title}`)}</Typography>
            </Grid>
            {frequentCategory && (
                <Grid item>
                    <Card sx={{ borderRadius: 10, backgroundColor: '#F5F8FF', px: '3rem', py: '0.3rem', fontWeight: 'bold' }}>
                        {frequentCategory.category
                            ? i18next.t(`feedbackManagementPage.categoryTypes.${frequentCategory.category}`)
                            : i18next.t('feedbackManagementPage.none')}
                    </Card>
                </Grid>
            )}
            {percentageByRating && !!percentageByRating.length && (
                <Grid item>
                    <Card sx={{ borderRadius: 10, backgroundColor: '#F5F8FF', px: '3rem', py: '0.3rem', fontWeight: 'bold' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flex: 'nowrap', gap: 0.5 }}>
                            <Typography fontWeight="bold">
                                {((5 / 100) * percentageByRating.find(({ rating }) => rating === 5)!.percentage).toFixed(1)}
                            </Typography>
                            <Typography>{i18next.t('feedbackManagementPage.statisticCube.from')}</Typography>
                            <Typography fontWeight="bold">{5}</Typography>
                            {customIcons[5].icon}
                        </Box>
                    </Card>
                </Grid>
            )}
            <Grid item>
                <Typography>
                    {title === 'overallSatisfaction' ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flex: 'nowrap', gap: 0.5 }}>
                            <Typography>{i18next.t('feedbackManagementPage.statisticCube.totalAmountFeedback')}</Typography>
                            <Typography fontWeight="bold">{totalAmountOfFeedbacks}</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flex: 'nowrap', gap: 0.5 }}>
                            <Typography fontWeight="bold">{frequentCategory && frequentCategory.count ? frequentCategory.count : 0}</Typography>
                            <Typography>{i18next.t('feedbackManagementPage.statisticCube.from')}</Typography>
                            <Typography fontWeight="bold">{totalAmountOfFeedbacks}</Typography>
                            <Typography>{i18next.t('feedbackManagementPage.statisticCube.feedbacks')}</Typography>
                        </Box>
                    )}
                </Typography>
            </Grid>
            {moreDetails && (
                <Grid item>
                    <Button onClick={() => setOpen(true)}> {i18next.t('feedbackManagementPage.moreDetails')}</Button>
                </Grid>
            )}
            {open && percentageByRating && (
                <StatisticsDialog
                    percentageByRating={percentageByRating}
                    totalAmountOfFeedbacks={totalAmountOfFeedbacks}
                    open={open}
                    handleClose={handleCloseDialog}
                />
            )}
        </Grid>
    );
};
