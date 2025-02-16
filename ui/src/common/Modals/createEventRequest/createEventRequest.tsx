import i18next from 'i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { RequestTypes } from '../../../interfaces/request';
import { date, greaterThanDate, minMax, requiredString } from '../../../utils/yup';
import DateField from '../DateField';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';

const { magicWidth } = environment;

const basicInfoSchema = yup.object({
    startDate: date.required(i18next.t('yupErrorMsg.required')),
    endDate: greaterThanDate('startDate').required(i18next.t('yupErrorMsg.required')),
    description: requiredString,
    amount: minMax(1),
    name: requiredString,
});

const EventRequest = () => {
    const { watch } = useFormContext();
    const watchStartDate: Date | undefined = watch('startDate');

    return (
        <GridWrapper container>
            <SnackBar requestType={RequestTypes.NEW_EVENT} />
            <TextFieldElement name="name" label={i18next.t('common.eventName')} required />
            <GridWithMultipleItems container>
                <TextFieldElement required name="description" label={i18next.t('common.description')} />
                <TextFieldElement
                    name="amount"
                    label={i18next.t('wizard.addFacilityRequest.peopleAmount')}
                    type="number"
                    inputProps={{ min: 1 }}
                    required
                />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <DateField name="startDate" label={i18next.t('common.startDate')} minDate={new Date(0)} sx={{ width: magicWidth }} required />
                <DateField
                    name="endDate"
                    label={i18next.t('common.endDate')}
                    minDate={watchStartDate || new Date(0)}
                    disabled={!watchStartDate}
                    sx={{ width: magicWidth }}
                    required
                />
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { EventRequest, basicInfoSchema };
