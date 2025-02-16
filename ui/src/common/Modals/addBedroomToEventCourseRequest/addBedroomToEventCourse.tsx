import i18next from 'i18next';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { Event } from '../../../interfaces/event';
import { RequestTypes } from '../../../interfaces/request';
import { Genders } from '../../../interfaces/soldier';
import { convertDateTolocaleString } from '../../../utils/today';
import { setValues } from '../../../utils/wizard';
import { minMax, requiredString } from '../../../utils/yup';
import EventSearch from '../EventSearch';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';

const { magicWidth } = environment;

const addSoldierToEventCourseInfoSchema = yup.object({
    gender: requiredString,
    amount: minMax(1, 20),
    eventId: requiredString,
});

const values = {
    startDate: '',
    endDate: '',
};

const AddBedroomToEventCourseInfo = (requestType: RequestTypes) => {
    const { setValue } = useFormContext();
    const [displaySavedData, setDisplaySavedData] = useState(false);
    const setDisabledTextFields = (currentEvent: Event) => {
        setValues<typeof values>(
            {
                startDate: convertDateTolocaleString(currentEvent.startDate),
                endDate: convertDateTolocaleString(currentEvent.endDate),
            },
            setValue,
        );
    };

    return (
        <GridWrapper container>
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={requestType} />
            <EventSearch maxWidth displaySavedData={displaySavedData} setDisabledTextFields={setDisabledTextFields} />

            <GridWithMultipleItems container>
                <TextFieldElement name="startDate" label={i18next.t('common.startDate')} sx={{ width: magicWidth }} disabled />

                <TextFieldElement name="endDate" label={i18next.t('common.endDate')} sx={{ width: magicWidth }} disabled />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <SelectElement
                    name="gender"
                    label={i18next.t('wizard.addBedroomToCourseRequest.gender')}
                    options={Object.values(Genders).map((gender) => ({ label: i18next.t(`wizard.addBedroomToCourseRequest.${gender}`), id: gender }))}
                    sx={{ width: magicWidth }}
                    required
                />

                <TextFieldElement
                    name="amount"
                    label={i18next.t('wizard.addBedroomToCourseRequest.amount')}
                    type="number"
                    inputProps={{ min: 1, max: 20 }}
                    sx={{ width: magicWidth }}
                    required
                />
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { AddBedroomToEventCourseInfo, addSoldierToEventCourseInfoSchema };
