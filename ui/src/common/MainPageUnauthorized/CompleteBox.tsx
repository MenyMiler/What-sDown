/* eslint-disable react/jsx-key */
/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Grid } from '@mui/material';
import SingleRequest from './SingleRequest';
import SingleDailyEvent from './SingleDailyEvent';
import { RequestDocument } from '../../interfaces/request';

export enum typeOfData {
    requests = 'requests',
    dailyEvents = 'dailyEvents',
}

interface ICompleteBoxProps {
    title: string;
    subTitle: React.ReactElement;
    type: typeOfData;
    dataToShow: RequestDocument[] | { title: string; type: string }[];
}

const CompleteBox = ({ title, subTitle, type, dataToShow }: ICompleteBoxProps) => (
    <Grid container direction="column" sx={{ p: 2, backgroundColor: 'white', borderRadius: '10px', minHeight: '26.5rem' }}>
        <Grid item container direction="row" justifyContent="space-between" sx={{ minHeight: '2.5rem' }}>
            <Grid item fontWeight="bold" fontSize="1.25rem">
                {title}
            </Grid>
            <Grid item>{subTitle}</Grid>
        </Grid>
        <Grid item container direction="column" alignItems="center" sx={{ mt: '1rem' }}>
            {type === typeOfData.requests
                ? (dataToShow as RequestDocument[]).map((request) => <SingleRequest request={request} />)
                : (dataToShow as { title: string; type: string }[]).map((dailyEvent) => (
                      <SingleDailyEvent title={dailyEvent.title} type={dailyEvent.type} />
                  ))}
        </Grid>
    </Grid>
);

export default CompleteBox;
