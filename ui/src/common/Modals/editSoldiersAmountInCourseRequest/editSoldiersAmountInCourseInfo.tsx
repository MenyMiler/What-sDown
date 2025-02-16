import { Grid, Switch } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { PopulatedCourse } from '../../../interfaces/course';
import { RequestTypes } from '../../../interfaces/request';
import { convertDateTolocaleString } from '../../../utils/today';
import { setValues } from '../../../utils/wizard';
import { getGendersAsObject, minMax, requiredString } from '../../../utils/yup';
import CourseSearch from '../CourseSearch';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';
import SoldierAmounts from './soldiersAmount';
import SpecialSoldierAmounts from './specialSoldiersAmount';

const { magicWidth } = environment;

const editSoldierAmountsInCourseInfoSchema = yup.object({
    courseId: requiredString,
    ...getGendersAsObject(minMax(0)),
});

const values = {
    courseACAId: '',
    type: '',
    branch: '',
    startDate: '',
    endDate: '',
    ...getGendersAsObject(0),
};

const EditSoldierAmountsInCourseInfo = () => {
    const { setValue } = useFormContext();
    const [checked, setChecked] = useState<boolean>(true);
    const [displaySavedData, setDisplaySavedData] = useState(false);

    const setDisabledTextFields = (currentCourse: PopulatedCourse) => {
        const { soldierAmounts, startDate, endDate, type, ...rest } = currentCourse;
        setValues<typeof values>(
            {
                ...rest,
                ...soldierAmounts,
                type: i18next.t(`common.types.${type}`),
                startDate: convertDateTolocaleString(startDate!),
                endDate: convertDateTolocaleString(endDate!),
            },
            setValue,
        );
    };

    return (
        <GridWrapper container>
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={RequestTypes.EDIT_SOLDIERS_AMOUNT} />
            <CourseSearch displaySavedData={displaySavedData} setDisabledTextFields={setDisabledTextFields} values={values} />
            <GridWithMultipleItems container>
                <TextFieldElement name="startDate" label={i18next.t('common.startDate')} disabled />

                <TextFieldElement name="endDate" label={i18next.t('common.endDate')} disabled />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <TextFieldElement name="courseACAId" label={i18next.t('common.courseACAId')} disabled />

                <TextFieldElement name="type" label={i18next.t('common.type')} disabled />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <Grid component="label" container alignItems="center" sx={{ width: magicWidth, fontSize: '14px', color: 'grey', marginLeft: '28%' }}>
                    <Grid item>{i18next.t('wizard.editSoldierAmountsInCourseRequest.specialSoldiers')}</Grid>
                    <Switch checked={checked} onChange={(event) => setChecked(event.target.checked)} />
                    <Grid item>{i18next.t('wizard.editSoldierAmountsInCourseRequest.ordinarySoldiers')}</Grid>
                </Grid>
            </GridWithMultipleItems>
            <div>{checked ? <SoldierAmounts /> : <SpecialSoldierAmounts />}</div>
        </GridWrapper>
    );
};

export { EditSoldierAmountsInCourseInfo, editSoldierAmountsInCourseInfoSchema };
