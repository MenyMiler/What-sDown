/* eslint-disable no-undef */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import { ArrowBackIos } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import style from '../styles';
import SingleDetailEvents from './SingleDetailEvents';
import { PopulatedEvent } from '../../../interfaces/event';
import { convertDateTolocaleString } from '../../../utils/today';
import { Genders } from '../../../interfaces/soldier';

interface IPageOnePros {
    event: PopulatedEvent;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const PageOneModal = ({ event, setPageIndex }: IPageOnePros) => {
    const getSingleDetailOfDateField = (fieldName: string, index: number) => {
        const fieldValue = event[fieldName as keyof typeof event];
        const value = fieldValue ? convertDateTolocaleString(fieldValue as Date) : '-';
        return <SingleDetailEvents key={index} title={fieldName} value={value} />;
    };
    const isConnectedToCourse: boolean = !!event.course;
    const getAmountForCourse = () => {
        const soldierAmounts = event.course?.soldierAmounts ?? {};
        const genderKeys: string[] = Object.values(Genders);
        const filteredAmounts = Object.entries(soldierAmounts)
            .filter(([key]) => genderKeys.includes(key))
            .reduce((sum, [, amount]) => sum + (typeof amount === 'number' ? amount : 0), 0);

        return filteredAmounts;
    };

    const getAmountStaff = () => {
        if (event.course?.staffRatio) return Math.ceil(getAmountForCourse() / event.course.staffRatio);
        return 1;
    };

    const dateFieldsToDisplay = ['startDate', 'endDate'];

    return (
        <Box sx={style}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {event.name}
            </Typography>
            <Grid container direction="row" justifyContent="center" spacing={10}>
                <Grid item>
                    <SingleDetailEvents title="name" value={event.name} />
                    <SingleDetailEvents title="description" value={event.description} />
                    {dateFieldsToDisplay.map(getSingleDetailOfDateField)}
                </Grid>
                {/* todo: might add edit users to event */}
                {/* <Grid item>
                     <Button
                    sx={{
                        marginTop: '4rem',
                        color: 'black',
                        border: `0.063rem solid ${colors.button.successSecondary}`,
                        borderRadius: '5px',
                        opacity: 1,
                        background: colors.button.successPrimary,
                    }}
                    variant="text"
                    component={Link}
                    to={`/edit-users/${event._id}`}
                >
                    <EditOutlined sx={{ color: colors.button.successSecondary }} />
                    <Typography sx={{ color: colors.button.successSecondary, ml: '0.4rem', fontSize: '1rem' }}>
                        {i18next.t('courseDetailsModal.editStudentsBtn')}
                    </Typography>
                </Button> 
                </Grid> */}
                <Grid item>
                    <SingleDetailEvents title="totalStudents" value={isConnectedToCourse ? getAmountForCourse() : event.amount} />
                    {isConnectedToCourse && (
                        <>
                            <SingleDetailEvents title="totalStaff" value={getAmountStaff()} />
                            <SingleDetailEvents title="totalFemale" value={event.course?.soldierAmounts.FEMALE} />
                            <SingleDetailEvents title="totalMale" value={event.course?.soldierAmounts.MALE} />
                            <SingleDetailEvents title="totalOtherFemale" value={event.course?.soldierAmounts.OTHER_FEMALE} />
                            <SingleDetailEvents title="totalOtherMale" value={event.course?.soldierAmounts.OTHER_MALE} />
                        </>
                    )}

                    <Button
                        sx={{ color: 'black', marginTop: isConnectedToCourse ? '4rem' : '20rem' }}
                        variant="text"
                        onClick={() => setPageIndex((curr) => (curr += 1))}
                    >
                        <Typography sx={{ mr: '1rem' }}>{i18next.t('courseDetailsModal.resources')}</Typography>
                        <ArrowBackIos />
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageOneModal;
