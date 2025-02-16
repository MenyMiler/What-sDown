import { Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { PopulatedCourseTemplate } from '../../../../interfaces/courseTemplate';
import { RequestTypes } from '../../../../interfaces/request';
import { clearValues, setValues } from '../../../../utils/wizard';
import { yupRequire } from '../../../../utils/yup';
import CourseSearch from '../../CourseSearch';
import SnackBar from '../../SnackBar';
import { GridWrapper } from '../../modals.styled';

enum CourseCreationMode {
    FROM_SCRATCH,
    FROM_COURSE_TEMPLATE,
    FROM_PAST_INSTANCE,
}

const creationModeSchema = yup.object({
    creationMode: yup.number().required(i18next.t('yupErrorMsg.required')),
    courseTemplateId: yup.string().when('creationMode', { is: CourseCreationMode.FROM_COURSE_TEMPLATE, then: yupRequire }),
    courseId: yup.string().when('creationMode', { is: CourseCreationMode.FROM_PAST_INSTANCE, then: yupRequire }),
});

const values = {
    name: '',
    courseACAId: '',
    type: '',
    networkId: '',
    courseBaseId: '',
    unit: '' as string | null,
    courseSAPId: '' as string | null,
    profession: '' as string | null,
    staffRatio: '',
    branchId: '',
};

const CreationMode = () => {
    const [courseCreationModes, setCourseCreationModes] = useState<{ id: CourseCreationMode; label: string }[]>([]);

    useEffect(() => {
        setCourseCreationModes([
            { id: CourseCreationMode.FROM_SCRATCH, label: i18next.t('wizard.addInstanceOfCourseRequest.fromScratch') },
            { id: CourseCreationMode.FROM_COURSE_TEMPLATE, label: i18next.t('wizard.addInstanceOfCourseRequest.fromCourseTemplate') },
            { id: CourseCreationMode.FROM_PAST_INSTANCE, label: i18next.t('wizard.addInstanceOfCourseRequest.fromPastInstance') },
        ]);
    }, []);

    const { watch, setValue } = useFormContext();
    const [displaySavedData, setDisplaySavedData] = useState(false);
    const creationMode: CourseCreationMode | undefined = watch('creationMode');

    const setDisabledTextFields = async (course: PopulatedCourseTemplate) => {
        const { name, courseACAId, type, branch, networks, base, unit, profession, courseSAPId, staffRatio } = course;
        setValues<Partial<typeof values>>(
            {
                name,
                courseACAId,
                type,
                networkId: networks[0]?._id,
                courseBaseId: base._id,
                unit,
                staffRatio: String(staffRatio),
                profession,
                courseSAPId,
                branchId: branch._id,
            },
            setValue,
        );
    };

    return (
        <GridWrapper container>
            {courseCreationModes && (
                <>
                    <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={RequestTypes.NEW_COURSE} />
                    <SelectElement
                        name="creationMode"
                        label={i18next.t('wizard.addInstanceOfCourseRequest.courseCreationMode')}
                        options={courseCreationModes}
                        onChange={(_value: CourseCreationMode) => clearValues<typeof values>(values, setValue)}
                        required
                    />

                    {(creationMode === CourseCreationMode.FROM_PAST_INSTANCE || creationMode === CourseCreationMode.FROM_COURSE_TEMPLATE) && (
                        <>
                            <CourseSearch
                                setDisabledTextFields={setDisabledTextFields}
                                values={values}
                                isCourse={creationMode === CourseCreationMode.FROM_PAST_INSTANCE}
                                displaySavedData={displaySavedData}
                            />
                            <Typography variant="subtitle1" textAlign="center" fontStyle="italic">
                                {i18next.t('wizard.addInstanceOfCourseRequest.canStillEditDetails')}
                            </Typography>
                        </>
                    )}
                </>
            )}
        </GridWrapper>
    );
};

export { CreationMode, creationModeSchema };
