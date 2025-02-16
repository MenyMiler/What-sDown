/* eslint-disable indent */
import i18next from 'i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { environment } from '../../../../globals';
import { RequestTypes } from '../../../../interfaces/request';
import { date, greaterThanDate } from '../../../../utils/yup';
import DateField from '../../DateField';
import SnackBar from '../../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../../modals.styled';

const { magicWidth } = environment;

const eventsInfoSchema = yup.object({
    startDatePreEvent: date,
    endDatePreEvent: greaterThanDate('startDatePreEvent')
        .nullable()
        .when('startDatePreEvent', (startDatePreEvent, schema) =>
            startDatePreEvent[0] ? schema.required(i18next.t('yupErrorMsg.required')) : schema,
        ),
    startDatePostEvent: date,
    endDatePostEvent: greaterThanDate('startDatePostEvent')
        .nullable()
        .when('startDatePostEvent', (startDatePostEvent, schema) =>
            startDatePostEvent[0] ? schema.required(i18next.t('yupErrorMsg.required')) : schema,
        ),
});

const EventsInfo = () => {
    const { watch } = useFormContext();
    const watchStartDatePreEvent: Date | undefined = watch('startDatePreEvent');
    const watchStartDatePostEvent: Date | undefined = watch('startDatePostEvent');
    const watchCourseStartDate: Date | undefined = watch('startDate');
    const watchEndDateStartDate: Date | undefined = watch('endDate');

    return (
        <GridWrapper container>
            <SnackBar isNextSteps requestType={RequestTypes.NEW_COURSE} />
            <GridWithMultipleItems container>
                <DateField
                    name="startDatePreEvent"
                    label={`${i18next.t('wizard.addInstanceOfCourseRequest.startDatePreEvent')}`}
                    minDate={new Date(0)}
                    sx={{ width: magicWidth }}
                />
                <DateField
                    name="endDatePreEvent"
                    label={`${i18next.t('wizard.addInstanceOfCourseRequest.endDatePreEvent')}`}
                    minDate={watchStartDatePreEvent || new Date(0)}
                    maxDate={watchCourseStartDate}
                    disabled={!watchStartDatePreEvent}
                    sx={{ width: magicWidth }}
                />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <DateField
                    name="startDatePostEvent"
                    label={`${i18next.t('wizard.addInstanceOfCourseRequest.startDatePostEvent')}`}
                    minDate={watchEndDateStartDate}
                    sx={{ width: magicWidth }}
                />
                <DateField
                    name="endDatePostEvent"
                    label={`${i18next.t('wizard.addInstanceOfCourseRequest.endDatePostEvent')}`}
                    minDate={watchStartDatePostEvent || new Date(0)}
                    disabled={!watchStartDatePostEvent}
                    sx={{ width: magicWidth }}
                />
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { EventsInfo, eventsInfoSchema };
