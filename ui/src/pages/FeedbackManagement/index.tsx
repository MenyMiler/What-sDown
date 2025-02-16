import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { FeedbackTypes, PopulatedFeedback } from '../../interfaces/feedback';
import ExportExcel from './excel/ExportExcel';
import FeedbacksTab from './feedbacks/FeedbacksTab';
import { FiltersForFeedbacks } from './feedbacks/FiltersForFeedbacks';
import { FeedbacksStatistics } from './statistics/FeedbacksStatistics';

const FeedbackManagementPage = () => {
    const [reRenderAllFlag, setReRenderAllFlag] = useState(false);
    const [filters, setFilters] = useState({});
    const [activeFeedbacksForExcel, setActiveFeedbacksForExcel] = useState<PopulatedFeedback[]>([]);

    return (
        <Grid container spacing={1}>
            <Grid item container>
                <FeedbacksStatistics />
            </Grid>
            <Grid item container direction="row" justifyContent="space-between">
                <Grid item sx={{ width: '10%', pt: '1rem' }}>
                    <ExportExcel disable={!!activeFeedbacksForExcel.length} populatedFeedbacks={activeFeedbacksForExcel} />
                </Grid>
                <Grid item container sx={{ width: '70%' }}>
                    <FiltersForFeedbacks setFilters={setFilters} filters={filters} />
                </Grid>
            </Grid>

            <Grid item container spacing={1.5} direction="column" flexWrap="nowrap" sx={{ mb: '2rem' }}>
                <Grid item>
                    <FeedbacksTab
                        reRenderAllFlag={reRenderAllFlag}
                        filters={filters}
                        setReRenderAllFlag={setReRenderAllFlag}
                        open
                        type={FeedbackTypes.NORMAL}
                        setActiveFeedbacksForExcel={setActiveFeedbacksForExcel}
                    />
                </Grid>
                <Grid item>
                    <FeedbacksTab reRenderAllFlag={reRenderAllFlag} setReRenderAllFlag={setReRenderAllFlag} type={FeedbackTypes.ARCHIVE} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default FeedbackManagementPage;
