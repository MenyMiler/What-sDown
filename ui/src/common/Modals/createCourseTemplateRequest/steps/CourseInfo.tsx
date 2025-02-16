import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import i18next from 'i18next';
import React from 'react';
import { TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { RequestTypes } from '../../../../interfaces/request';
import { optionalNumber, requiredString } from '../../../../utils/yup';
import SnackBar from '../../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../../modals.styled';

const courseInfoSchema = yup.object({
    name: requiredString,
    courseACAId: requiredString,
    profession: yup.string(),
    courseSAPId: yup.string(),
    staffRatio: optionalNumber,
});

const CourseInfo = () => {
    return (
        <GridWrapper container>
            <SnackBar requestType={RequestTypes.NEW_COURSE_TEMPLATE} />
            <GridWithMultipleItems container>
                <TextFieldElement name="name" label={i18next.t('common.name')} required />
                <TextFieldElement name="courseACAId" label={i18next.t('common.courseACAId')} required />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <TextFieldElement name="profession" label={i18next.t('common.profession')} />
                <TextFieldElement name="courseSAPId" label={i18next.t('common.courseSAPId')} />
            </GridWithMultipleItems>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <TextFieldElement
                    name="staffRatio"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ width: '35%' }}
                    label={i18next.t('common.staffRatio')}
                />
                <Typography sx={{ color: 'gray', fontSize: '1.5rem', mt: '0.5rem' }}>: 1</Typography>
            </Box>
        </GridWrapper>
    );
    // TODO staff ratio change to disabled text field
};

export { CourseInfo, courseInfoSchema };
