import i18next from 'i18next';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { PopulatedCourse } from '../../../../interfaces/course';
import { convertDateTolocaleString } from '../../../../utils/today';
import { setValues } from '../../../../utils/wizard';
import { date, greaterThanDate, requiredString } from '../../../../utils/yup';
import CourseSearch from '../../CourseSearch';
import DateField from '../../DateField';
import { GridItemsWithGreyBackground } from '../../GridItemsWithGreyBackground';
import { GridWithMultipleItems, GridWrapper } from '../../modals.styled';

const changeDatesSchema = yup.object({
    courseId: requiredString,
    newStartDate: date.required(i18next.t('yupErrorMsg.required')),
    newEndDate: greaterThanDate('newStartDate').required(i18next.t('yupErrorMsg.required')),
});

const values = {
    courseACAId: '',
    branch: '',
    type: '',
    previousStartDate: '',
    previousEndDate: '',
    newStartDate: '',
    newEndDate: '',
};

const ChangeDates = () => {
    const { watch, setValue } = useFormContext();
    const watchNewStartDate: Date | undefined = watch('newStartDate');
    const [pastCourseFlag, setPastCourseFlag] = useState({ start: false, end: false });

    const setDisabledTextFields = (currentCourse: PopulatedCourse) => {
        setPastCourseFlag({
            start: new Date(currentCourse.startDate).getTime() < new Date().getTime(),
            end: new Date(currentCourse.endDate).getTime() < new Date().getTime(),
        });
        setValues<typeof values>(
            {
                courseACAId: currentCourse.courseACAId,
                branch: currentCourse.branch.name,
                type: i18next.t(`common.types.${currentCourse.type}`),
                previousStartDate: convertDateTolocaleString(currentCourse.startDate),
                previousEndDate: convertDateTolocaleString(currentCourse.endDate),
                newStartDate: new Date(currentCourse.startDate).getTime() < new Date().getTime() ? (currentCourse.startDate as any) : '',
                newEndDate: new Date(currentCourse.endDate).getTime() < new Date().getTime() ? (currentCourse.endDate as any) : '',
            },
            setValue,
        );
    };

    return (
        <GridWrapper container>
            <CourseSearch displaySavedData={false} setDisabledTextFields={setDisabledTextFields} values={values} />
            <TextFieldElement name="branch" label={i18next.t('common.branch')} disabled />

            <GridWithMultipleItems container>
                <TextFieldElement name="courseACAId" sx={{ width: '47%' }} label={i18next.t('common.courseACAId')} disabled />
                <TextFieldElement name="type" sx={{ width: '50%' }} label={i18next.t('common.type')} disabled />
            </GridWithMultipleItems>

            <GridItemsWithGreyBackground title={i18next.t('wizard.changeCourseDatesRequest.previousDate')} fullWidth>
                <TextFieldElement
                    name="previousStartDate"
                    label={i18next.t('wizard.changeCourseDatesRequest.start')}
                    sx={{ width: '15rem' }}
                    disabled
                />
                <TextFieldElement name="previousEndDate" label={i18next.t('wizard.changeCourseDatesRequest.end')} sx={{ width: '15rem' }} disabled />
            </GridItemsWithGreyBackground>

            <GridItemsWithGreyBackground title={i18next.t('wizard.changeCourseDatesRequest.newDate')} fullWidth>
                <DateField name="newStartDate" label={i18next.t('wizard.changeCourseDatesRequest.start')} required disabled={pastCourseFlag.start} />
                <DateField
                    name="newEndDate"
                    label={i18next.t('wizard.changeCourseDatesRequest.end')}
                    minDate={watchNewStartDate || new Date()}
                    required
                    disabled={pastCourseFlag.end}
                />
            </GridItemsWithGreyBackground>
        </GridWrapper>
    );
};

export { ChangeDates, changeDatesSchema };
