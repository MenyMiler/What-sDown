/* eslint-disable no-nested-ternary */
import i18next from 'i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { date, greaterThanDate, yupRequire } from '../../../../utils/yup';
import DateField from '../../DateField';
import { GridWrapper } from '../../modals.styled';

const datesInfoSchema = yup.object({
    startDate: date.when('selectDates', { is: 0, then: yupRequire }),
    endDate: greaterThanDate('startDate').when('selectDates', { is: 0, then: yupRequire }),
    duration: yup.number().when('selectDates', { is: 1, then: yupRequire }),
    scale: yup.string().when('selectDates', { is: 1, then: yupRequire }),
});

const handleArrayIteration = (array: string[]) => {
    return array.map((option, index) => ({ id: index, label: i18next.t(`wizard.createCourseTemplate.${option}`) }));
};

const selectDatesOptions = ['static', 'dynamic'];
const scaleOptions = ['days', 'weeks'];

const DatesInfo = () => {
    const { watch } = useFormContext();
    const watchSelectDateOption: number | undefined = watch('selectDates');
    const watchStartDate: Date | undefined = watch('startDate');

    const getDateSelection = (selectDateOption: number | undefined) => {
        switch (selectDateOption) {
            case 0:
                return (
                    <>
                        <DateField name="startDate" label={i18next.t('wizard.addInstanceOfCourseRequest.startDate')} required />
                        <DateField
                            name="endDate"
                            label={i18next.t('wizard.addInstanceOfCourseRequest.endDate')}
                            minDate={watchStartDate || new Date()}
                            required
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <SelectElement
                            name="scale"
                            label={i18next.t('wizard.createCourseTemplate.scale')}
                            options={handleArrayIteration(scaleOptions)}
                            required
                        />
                        <TextFieldElement name="duration" label={i18next.t('wizard.createCourseTemplate.duration')} required />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <GridWrapper container>
            <SelectElement
                name="selectDates"
                label={i18next.t('wizard.createCourseTemplate.selectDates')}
                options={handleArrayIteration(selectDatesOptions)}
                required
            />
            {getDateSelection(watchSelectDateOption)}
        </GridWrapper>
    );
};

export { DatesInfo, datesInfoSchema };
