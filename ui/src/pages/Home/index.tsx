import React from 'react';
import { Box, Grid } from '@mui/material';
import DailyEvents from '../../common/dailyEvents';
import TopBarGeneralStatistics from '../../common/generalStatistics';
import Piecharts from '../../common/Piecharts';
import StatisticsBlock from '../../common/statistics';
import { Types as UserTypes } from '../../interfaces/user';
import MainPageUnauthorized from '../../common/MainPageUnauthorized';
import { useUserStore } from '../../stores/user';

const handleDataForUserByHisType = (userType: UserTypes) => {
    switch (userType) {
        case UserTypes.SUPERADMIN:
        case UserTypes.RESOURCE_MANAGER:
            return (
                <Grid container direction="column" justifyContent="space-between" spacing={2} sx={{ my: '2.5rem' }}>
                    <Grid item>
                        <TopBarGeneralStatistics />
                    </Grid>
                    <Grid item>
                        <Piecharts />
                    </Grid>
                    <Grid container item spacing={2}>
                        <Grid item>
                            <StatisticsBlock />
                        </Grid>
                        <Grid item xs>
                            <DailyEvents />
                        </Grid>
                    </Grid>
                </Grid>
            );
        case UserTypes.AUTHORIZED:
        case UserTypes.PLANNING:
        case UserTypes.SERGEANT:
        case UserTypes.BASIC_USER:
        case UserTypes.VISITOR:
            return <MainPageUnauthorized />;
        default:
            return <div />;
    }
};

const Home = () => {
    const currentUser = useUserStore(({ user }) => user);
    return handleDataForUserByHisType(currentUser.currentUserType!);
};

export default Home;
