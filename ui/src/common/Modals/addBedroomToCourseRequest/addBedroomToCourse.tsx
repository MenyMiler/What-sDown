import i18next from 'i18next';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { PopulatedCourse } from '../../../interfaces/course';
import { RequestTypes } from '../../../interfaces/request';
import { Genders } from '../../../interfaces/soldier';
import { convertDateTolocaleString } from '../../../utils/today';
import { setValues } from '../../../utils/wizard';
import { minMax, requiredString } from '../../../utils/yup';
import CourseSearch from '../CourseSearch';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';

const { magicWidth } = environment;

const addSoldierToCourseInfoSchema = yup.object({
    courseId: requiredString,
    gender: requiredString,
    amount: minMax(1, 20),
});

const values = {
    type: '',
    branch: '',
    startDate: '',
    endDate: '',
};

const AddBedroomToCourseInfo = (requestType: RequestTypes) => {
    const { setValue } = useFormContext();
    const [displaySavedData, setDisplaySavedData] = useState(false);

    const setDisabledTextFields = (currentCourse: PopulatedCourse) => {
        setValues<typeof values>(
            {
                type: i18next.t(`common.types.${currentCourse.type}`),
                branch: currentCourse.branch.name,
                startDate: convertDateTolocaleString(currentCourse.startDate),
                endDate: convertDateTolocaleString(currentCourse.endDate),
            },
            setValue,
        );
    };

    return (
        <GridWrapper container>
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={requestType} />
            <CourseSearch displaySavedData={displaySavedData} setDisabledTextFields={setDisabledTextFields} values={values} />

            <GridWithMultipleItems container>
                <TextFieldElement name="startDate" label={i18next.t('common.startDate')} disabled />

                <TextFieldElement name="endDate" label={i18next.t('common.endDate')} disabled />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <TextFieldElement name="branch" label={i18next.t('common.branch')} disabled />

                <TextFieldElement name="type" label={i18next.t('common.type')} disabled />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <SelectElement
                    name="gender"
                    label={i18next.t('wizard.addBedroomToCourseRequest.gender')}
                    options={Object.values(Genders).map((gender) => ({
                        label: i18next.t(`wizard.addBedroomToCourseRequest.${gender}`),
                        id: gender,
                    }))}
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

export { AddBedroomToCourseInfo, addSoldierToCourseInfoSchema };
