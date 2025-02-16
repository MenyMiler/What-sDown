import { Grid } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import Legend from '../../common/Legend';
import { SortDate } from '../../common/filterSelect/SortDate';
import ResourcesView from '../../common/resources/resourcesView';
import { environment } from '../../globals';

const { colors } = environment;

const ResourceManagementPage: React.FC<{}> = () => {
    const [dateFilter, setDateFilter] = useState<{ startDate?: Date }>({});
    const [startDate, setStartDate] = useState<Date>(new Date());

    useEffect(() => {
        if (dateFilter.startDate) setStartDate(dateFilter.startDate);
    }, [dateFilter]);

    return (
        <Grid container direction="column" spacing={2}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item sx={{ pl: '16px' }}>
                    <SortDate setFilter={setDateFilter} />
                </Grid>
                <Grid item>
                    <Legend
                        items={[
                            { dotColor: `${colors.resourceState.full}`, text: `${i18next.t('resourceManagement.resourceStateColors.full')}` },
                            { dotColor: `${colors.resourceState.occupied}`, text: `${i18next.t('resourceManagement.resourceStateColors.occupied')}` },
                            { dotColor: `${colors.resourceState.empty}`, text: `${i18next.t('resourceManagement.resourceStateColors.empty')}` },
                        ]}
                        sx={{ display: 'flex', gap: '2rem' }}
                        spacing="space-between"
                    />
                </Grid>
            </Grid>
            <Grid item height="78vh">
                <ResourcesView startDate={startDate} />
            </Grid>
        </Grid>
    );
};

export default ResourceManagementPage;
