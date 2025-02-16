import i18next from 'i18next';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { Event } from '../../../interfaces/event';
import { RequestTypes } from '../../../interfaces/request';
import { convertDateTolocaleString } from '../../../utils/today';
import { setValues } from '../../../utils/wizard';
import { minMax, requiredString } from '../../../utils/yup';
import EventSearch from '../EventSearch';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';

const { magicWidth } = environment;

const basicInfoSchema = yup.object({
    amount: minMax(1),
    comments: yup.string(),
    eventId: requiredString,
});

const values = {
    startDate: '',
    endDate: '',
};

const OfficeRequest = () => {
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
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={RequestTypes.NEW_OFFICE_TO_EVENT} />
            <GridWithMultipleItems container>
                <EventSearch displaySavedData={displaySavedData} setDisabledTextFields={setDisabledTextFields} />
                <TextFieldElement
                    name="amount"
                    label={i18next.t('wizard.addFacilityRequest.peopleAmount')}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: magicWidth }}
                    required
                />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <TextFieldElement name="startDate" label={i18next.t('common.startDate')} sx={{ width: magicWidth }} disabled />

                <TextFieldElement name="endDate" label={i18next.t('common.endDate')} sx={{ width: magicWidth }} disabled />
            </GridWithMultipleItems>

            <TextFieldElement name="comments" label={i18next.t('wizard.addFacilityRequest.comment')} />
        </GridWrapper>
    );
};

export { OfficeRequest, basicInfoSchema };
