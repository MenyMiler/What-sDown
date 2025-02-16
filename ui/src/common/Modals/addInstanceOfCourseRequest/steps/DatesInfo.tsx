/* eslint-disable indent */
import i18next from 'i18next';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../../globals';
import { Types } from '../../../../interfaces/courseTemplate';
import { RequestTypes } from '../../../../interfaces/request';
import { LocalStorage } from '../../../../utils/localStorage';
import { date, greaterThanDate, optionalNumber, requiredString } from '../../../../utils/yup';
import DateField from '../../DateField';
import SnackBar from '../../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../../modals.styled';

const { magicWidth } = environment;

const datesInfoSchema = yup.object({
    startDate: date.required(i18next.t('yupErrorMsg.required')),
    endDate: greaterThanDate('startDate').required(i18next.t('yupErrorMsg.required')),
    type: requiredString,
    bootCampStartDate: date,
    bootCampEndDate: greaterThanDate('bootCampStartDate'),
    year: yup.string(),
    RAKAZCourseDuration: optionalNumber,
    actualCourseDuration: optionalNumber,
    receivanceDate: date,
    enlistmentDate: date,
});

const DatesInfo = () => {
    const { watch, setValue } = useFormContext();
    const watchStartDate: Date | undefined = watch('startDate');
    const watchBasicTrainingStartDate: Date | undefined = watch('bootCampStartDate');
    const watchType: Types | undefined = watch('type');

    useEffect(() => {
        if (!watchStartDate) return;
        const inputValues = LocalStorage.get(RequestTypes.NEW_COURSE, '');
        const { startDate } = JSON.parse(inputValues);
        setValue('year', startDate ? new Date(startDate).getFullYear() : watchStartDate.getFullYear());
    }, [watchStartDate]);

    return (
        <GridWrapper container>
            <SnackBar isNextSteps requestType={RequestTypes.NEW_COURSE} />
            <GridWithMultipleItems container>
                <DateField
                    name="startDate"
                    label={`${i18next.t('wizard.addInstanceOfCourseRequest.startDate')}`}
                    minDate={new Date(0)}
                    required
                    sx={{ width: magicWidth }}
                />
                <DateField
                    name="endDate"
                    label={`${i18next.t('wizard.addInstanceOfCourseRequest.endDate')}`}
                    minDate={watchStartDate || new Date(0)}
                    disabled={!watchStartDate}
                    required
                    sx={{ width: magicWidth }}
                />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <DateField
                    name="bootCampStartDate"
                    label={i18next.t('wizard.addInstanceOfCourseRequest.basicTrainingStartDate')}
                    minDate={new Date(0)}
                    sx={{ width: magicWidth }}
                />
                <DateField
                    name="bootCampEndDate"
                    label={i18next.t('wizard.addInstanceOfCourseRequest.basicTrainingEndDate')}
                    minDate={watchBasicTrainingStartDate || new Date(0)}
                    disabled={!watchBasicTrainingStartDate}
                    sx={{ width: magicWidth }}
                />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <SelectElement
                    name="type"
                    label={i18next.t('common.type')}
                    options={Object.values(Types).map((type) => ({ id: type, label: i18next.t(`common.types.${type}`) }))}
                    required
                    sx={{ width: magicWidth }}
                />
                <TextFieldElement name="year" label={i18next.t('common.year')} />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <TextFieldElement
                    name="RAKAZCourseDuration"
                    label={i18next.t('common.RAKAZCourseDuration')}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                />
                <TextFieldElement
                    name="actualCourseDuration"
                    label={i18next.t('common.actualCourseDuration')}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                />
            </GridWithMultipleItems>
            <DateField name="receivanceDate" label={i18next.t('common.receivanceDate')} minDate={new Date(0)} />
            {watchType === Types.PRE_ENLISTMENT && (
                <DateField name="enlistmentDate" label={i18next.t('common.enlistmentDate')} minDate={new Date(0)} />
            )}
        </GridWrapper>
    );
};

export { DatesInfo, datesInfoSchema };
