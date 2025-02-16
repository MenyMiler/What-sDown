/* eslint-disable react/require-default-props */
import { Grid } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import CourseSearch from '../CourseSearch';
import DateField from '../DateField';

interface IGridForCourseProps {
    displaySavedData: boolean;
    name?: string;
    setDisabledTextFields: (course: any) => void;
    values: any;
}

const GridForCourse = ({ displaySavedData, name, setDisabledTextFields, values }: IGridForCourseProps) => (
    <Grid>
        <CourseSearch displaySavedData={displaySavedData} handleClear name={name} setDisabledTextFields={setDisabledTextFields} values={values} />
        <Grid item sx={{ marginTop: '5%' }}>
            <DateField name={name ? 'startDateDestCourse' : 'startDate'} label={i18next.t(`common.${'startDate'}`)} sx={{ width: 211 }} disabled />
        </Grid>
        <Grid item sx={{ marginTop: '5%' }}>
            <DateField name={name ? 'endDateDestCourse' : 'endDate'} label={i18next.t(`common.${'endDate'}`)} sx={{ width: 211 }} disabled />
        </Grid>
    </Grid>
);

export default GridForCourse;
