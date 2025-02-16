import { AutocompleteInputChangeReason } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { CourseDocument } from '../../../interfaces/course';
import { RequestTypes } from '../../../interfaces/request';
import { BasesService } from '../../../services/bases';
import { CoursesService } from '../../../services/courses';
import { convertDateTolocaleString } from '../../../utils/today';
import { setValues } from '../../../utils/wizard';
import { date, greaterThanDate, minMax, requiredString } from '../../../utils/yup';
import DateField from '../DateField';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';

const { magicWidth } = environment;

const basicInfoSchema = yup.object({
    courseId: requiredString,
    startDate: date.required(i18next.t('yupErrorMsg.required')),
    endDate: greaterThanDate('startDate').required(i18next.t('yupErrorMsg.required')),
    description: requiredString,
    amount: minMax(1),
    name: requiredString,
    baseId: requiredString,
});

const values = {
    startDate: '',
    endDate: '',
};

const EventRequest = () => {
    const [courses, setCourses] = useState<CourseDocument[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [displaySavedData, setDisplaySavedData] = useState(false);

    const { data: bases } = useQuery({
        queryKey: ['bases'],
        queryFn: () => BasesService.getByQuery(),
        meta: { errorMessage: i18next.t('wizard.admins.errors.baseError') },
        initialData: [],
    });

    const { watch, setValue } = useFormContext();
    const watchCourseId: string | undefined = watch('courseId');
    const watchStartDate: Date | undefined = watch('startDate');

    const setDisabledTextFields = async (currentEvent: string) => {
        const currentCourse = await CoursesService.getById(currentEvent, false);

        setValues<typeof values>(
            {
                startDate: currentCourse.startDate.toISOString(),
                endDate: currentCourse.endDate.toISOString(),
            },
            setValue,
        );
    };

    const setChosenCourseOnStepLoad = async () => {
        if (!watchCourseId) return;
        setCoursesLoading(true);
        const course = await CoursesService.getById(watchCourseId, false);
        setCourses([course]);
        setCoursesLoading(false);
    };

    const searchCourseDebounced = _.debounce(
        async (_e: React.SyntheticEvent<Element, Event>, courseName: string, reason: AutocompleteInputChangeReason) => {
            if (reason === 'input') {
                setValue('courseId', '');
            }
            setCoursesLoading(true);
            if (courseName) {
                setCourses(await CoursesService.getByQuery({ startDate: new Date(), limit: 10, populate: false }));
            } else setCourses([]);
            setCoursesLoading(false);
        },
        500,
    );

    useEffect(() => {
        setChosenCourseOnStepLoad();
    }, [displaySavedData]);

    return (
        <GridWrapper container>
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={RequestTypes.NEW_EVENT_RELATED_TO_COURSE} />
            <AutocompleteElement
                name="courseId"
                label={i18next.t('common.courseName')}
                options={courses.map((option) => ({
                    label: `${option.name} ${convertDateTolocaleString(option.startDate)}-${convertDateTolocaleString(option.endDate)}`,
                    id: option._id,
                }))}
                loading={coursesLoading}
                autocompleteProps={{
                    isOptionEqualToValue: (option, value) => option === value,
                    disableClearable: true,
                    freeSolo: true,
                    onInputChange: searchCourseDebounced,

                    onChange: (_event, value) => setDisabledTextFields(value.id),
                }}
                required
                matchId
            />
            <GridWithMultipleItems container>
                <AutocompleteElement
                    name="baseId"
                    label={i18next.t('sideBar.bases.base')}
                    options={bases.map((option) => ({
                        label: option.name,
                        id: option._id,
                    }))}
                    autocompleteProps={{
                        isOptionEqualToValue: (option, value) => option === value,
                        disableClearable: true,
                        sx: { width: magicWidth },
                    }}
                    required
                    matchId
                />
                <TextFieldElement sx={{ width: magicWidth }} name="name" label={i18next.t('common.eventName')} required />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <DateField name="startDate" label={i18next.t('common.startDate')} sx={{ width: magicWidth }} required />
                <DateField
                    name="endDate"
                    label={i18next.t('common.endDate')}
                    minDate={watchStartDate || new Date()}
                    sx={{ width: magicWidth }}
                    required
                />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <TextFieldElement
                    name="amount"
                    label={i18next.t('wizard.addFacilityRequest.peopleAmount')}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: magicWidth }}
                    required
                />
                <TextFieldElement name="description" label={i18next.t('common.description')} sx={{ width: magicWidth }} required />
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { EventRequest, basicInfoSchema };
