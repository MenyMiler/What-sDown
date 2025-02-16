/* eslint-disable react/require-default-props */
/* eslint-disable indent */
import { AutocompleteInputChangeReason, SxProps } from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import React, { Dispatch, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteElement } from 'react-hook-form-mui';
import { toast } from 'react-toastify';
import { PopulatedCourse } from '../../interfaces/course';
import { PopulatedCourseTemplate } from '../../interfaces/courseTemplate';
import { NetworkDocument } from '../../interfaces/network';
import { CourseTemplatesService } from '../../services/courseTemplates';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';
import { convertDateTolocaleString } from '../../utils/today';
import { clearValues } from '../../utils/wizard';

interface ICourseSearchProps {
    displaySavedData: boolean;
    setDisabledTextFields: (course: any) => void;
    values: any;
    isCourse?: boolean;
    handleClear?: boolean;
    name?: string;
    sx?: SxProps;
    size?: 'small' | 'medium' | undefined;
    setNetworks?: Dispatch<React.SetStateAction<NetworkDocument[]>>;
}

const sortCoursesByStartDate = (a: PopulatedCourse, b: PopulatedCourse) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

const sortCourseTemplatesById = (a: PopulatedCourseTemplate, b: PopulatedCourseTemplate) => a.courseACAId.localeCompare(b.courseACAId);

const CourseSearch = (props: ICourseSearchProps) => {
    const { displaySavedData, setDisabledTextFields, values, isCourse = true, sx, size, setNetworks, handleClear, name = 'courseId' } = props;
    const currentUser = useUserStore(({ user }) => user);
    const [fieldName, setFieldName] = useState<string>(isCourse ? name : 'courseTemplateId');
    const [courses, setCourses] = useState<PopulatedCourse[] | PopulatedCourseTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { setValue, watch } = useFormContext();

    const watchCourseId = watch(fieldName);

    const handleClearEvent = () => setDisabledTextFields(null);

    const searchCourses = async (_event: any, input: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input' || reason === 'clear') {
            setValue(fieldName, '');
            clearValues(values, setValue);
        }

        if (reason === 'clear') {
            setCourses([]);
            if (handleClear) handleClearEvent();
            return;
        }

        setLoading(true);

        try {
            const coursesOptions = await (isCourse ? CoursesService : CourseTemplatesService).getByQuery({
                name: input,
                baseId: currentUser.baseId!,
                populate: true,
            });
            setCourses(isCourse ? (coursesOptions as PopulatedCourse[]).sort(sortCoursesByStartDate) : coursesOptions.sort(sortCourseTemplatesById));
        } catch (error: any) {
            toast.error(i18next.t(`wizard.errors.${isCourse ? 'errorGettingCourses' : 'errorGettingCourseTemplates'}`));
        } finally {
            setLoading(false);
        }
    };

    const getAutocompleteOptions = (course: PopulatedCourse | PopulatedCourseTemplate) => {
        const { _id, courseACAId } = course;

        return {
            id: _id,
            label: `${course.name} - ${courseACAId}${
                isCourse
                    ? `  |  ${convertDateTolocaleString((course as PopulatedCourse).endDate)} - ${convertDateTolocaleString(
                          (course as PopulatedCourse).startDate,
                      )}`
                    : ''
            }`,
        };
    };

    const getCourse = async (_id: string) => {
        const course = await (isCourse ? CoursesService : CourseTemplatesService).getById(_id, true);
        if (setNetworks) setNetworks(course.networks);
        return course;
    };

    const handleChange = async (_event: any, value: { label: string; id: string }) => {
        if (!value) return;

        setDisabledTextFields(await getCourse(value.id));
    };

    const setChosenCourseOnStepLoad = async () => {
        if (!watchCourseId) return;
        setLoading(true);
        setCourses([await getCourse(watchCourseId)]);
        setLoading(false);
    };

    useEffect(() => {
        setChosenCourseOnStepLoad();
    }, [displaySavedData]);

    useEffect(() => {
        setFieldName(isCourse ? name : 'courseTemplateId');
    }, [isCourse]);

    return (
        <AutocompleteElement
            name={fieldName}
            label={i18next.t('common.courseName')}
            options={courses.map(getAutocompleteOptions)}
            loading={loading}
            autocompleteProps={{
                freeSolo: true,
                onInputChange: _.debounce(searchCourses, 500),
                onChange: handleChange,
                sx,
                size,
            }}
            required
            matchId
        />
    );
};

export default CourseSearch;
