import { Box, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { UserState } from '../stores/user';

type GreetingProps = {
    name: UserState['user']['name'];
};

const Greeting: React.FC<GreetingProps> = ({ name }) => {
    const currentDayTime = new Date().getHours();

    const getGreetingText = () => {
        if (currentDayTime >= 6 && currentDayTime < 12) {
            return i18next.t('greeting.morning');
        }
        if (currentDayTime >= 12 && currentDayTime < 17) {
            return i18next.t('greeting.noon');
        }
        if (currentDayTime >= 17 && currentDayTime < 21) {
            return i18next.t('greeting.evening');
        }
        return i18next.t('greeting.night');
    };

    const getName = () => {
        const nameToShow = Object.values(name);
        return nameToShow.join(nameToShow.length === 2 ? ' ' : '');
    };

    return (
        <Box>
            <Typography variant="h6" noWrap color="white">
                {`${getGreetingText()}`}
            </Typography>
            <Typography variant="h6" noWrap color="white">
                {getName()}
            </Typography>
        </Box>
    );
};

export { Greeting };
