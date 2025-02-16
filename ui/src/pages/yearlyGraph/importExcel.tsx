/* eslint-disable no-param-reassign */
import { Promise } from 'bluebird';
import i18next from 'i18next';
import React from 'react';
import { toast } from 'react-toastify';
import { environment } from '../../globals';
import { Course, PopulatedCourse } from '../../interfaces/course';
import { i18TranslateCategories } from '../../utils/excel/categories';
import excelParser from '../../utils/excel/parser';
import { trycatch } from '../../utils/trycatch';
import ExcelButton from './excelButton';
import { EventsService } from '../../services/events';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';
import { ActivityLogService } from '../../services/activityLogs';
import { ActivityTypes, ActionTypes } from '../../interfaces/activityLogs';

const { datesForEventsAdjoinedToCourseByDefault } = environment;

const ImportExcel = ({ reloadData }: { reloadData: Function }) => {
    const currentUser = useUserStore(({ user }) => user);

    const getDatesFromGraphLine = (line?: string | Date) => {
        if (!line) return undefined;

        if (line instanceof Date) return line as Date;

        const [day, month, year] = line.split('/');

        return new Date(+year, +month - 1, +day);
    };

    const createRelatedToCoursesByDefault = async (courses: PopulatedCourse[]) => {
        Promise.map(courses, ({ _id: courseId, name, base: { _id: baseId }, startDate, endDate }: PopulatedCourse) => {
            const { beforeDate, afterDate } = datesForEventsAdjoinedToCourseByDefault;

            const beforeCourseDate = new Date(startDate);
            beforeCourseDate.setDate(beforeCourseDate.getDate() - beforeDate);
            const afterCourseDate = new Date(endDate);
            afterCourseDate.setDate(afterCourseDate.getDate() + afterDate);

            return Promise.map(
                [
                    {
                        name: `${i18next.t('sideBar.relatedCourseRequests.staffPreparationForCourse')} ${name}`,
                        description: i18next.t('sideBar.relatedCourseRequests.staffPreparation'),
                        courseId,
                        baseId,
                        startDate: beforeCourseDate,
                        endDate: startDate,
                        amount: 0,
                    },
                    {
                        name: `${i18next.t('sideBar.relatedCourseRequests.courseSummary')} ${name}`,
                        description: i18next.t('sideBar.relatedCourseRequests.courseSummary'),
                        courseId,
                        baseId,
                        startDate: endDate,
                        endDate: afterCourseDate,
                        amount: 0,
                    },
                ],
                (eventData) => EventsService.createOne(eventData),
            );
        });
    };

    const handleChange = async (event: any) => {
        const file = event.target.files[0];

        const { err, result: graphs } = await trycatch(() => excelParser(file, i18TranslateCategories.i18TranslateAnnualGraphCategories));

        if (err) {
            toast.error(i18next.t(`excelCategories.errors.${(err as Error).message}`));
            event.target.value = '';
            return;
        }

        const coursesToCreate = graphs?.map(
            (graph) =>
                ({
                    name: String(graph.courseName),
                    type: graph.courseType,
                    branch: graph.branch,
                    network: graph.network,
                    baseName: graph.courseLocation,
                    courseACAId: String(graph.courseId),
                    ...(graph.unit && { unit: String(graph.unit) }),
                    ...(graph.profession && { profession: String(graph.profession) }),
                    ...(graph.courseSAPId && { courseSAPId: String(graph.courseSAPId) }),
                    startDate: getDatesFromGraphLine(graph.startDate)!,
                    endDate: getDatesFromGraphLine(graph.endDate)!,
                    bootCamp: {
                        startDate: getDatesFromGraphLine(graph.basicTrainingStartDate),
                        endDate: getDatesFromGraphLine(graph.basicTrainingEndDate),
                    },
                    year: graph.year,
                    durations: {
                        rakaz: graph.RAKAZCourseDuration,
                        actual: graph.actualCourseDuration,
                    },
                    ...(graph.receivanceDate && { receivanceDate: getDatesFromGraphLine(graph.receivanceDate) }),
                    ...(graph.enlistmentDate && { enlistmentDate: getDatesFromGraphLine(graph.enlistmentDate) }),
                    userType: currentUser.currentUserType!,
                    soldierAmounts: {
                        male: graph.iturMale || 0,
                        female: graph.iturFemale || 0,
                        specialMale: graph.specialMale || 0,
                        specialFemale: graph.specialFemale || 0,
                    },
                } as Omit<Course, 'baseId' | 'facilities' | 'bedrooms'> & { baseName: string }),
        );

        try {
            if (!coursesToCreate) {
                toast.error(i18next.t('excelCategories.errors.readExcelError'));
            } else {
                const courses = await CoursesService.createBulk(coursesToCreate, true);
                createRelatedToCoursesByDefault(courses);
                toast.success(i18next.t('excelCategories.createdSuccessfully'));
                await ActivityLogService.createOne({
                    name: localStorage.getItem('excelName')!,
                    userId: currentUser.genesisId,
                    type: ActivityTypes.EXCEL,
                    action: ActionTypes.ADD,
                    metaData: { excelData: [...(graphs || [])] },
                });
            }
        } catch (error: any) {
            toast.error(i18next.t('excelCategories.errors.createError'));
        }

        event.target.value = '';
        reloadData();
    };

    return <ExcelButton uploadFile={handleChange} text={i18next.t('excel.importExcel.import')} />;
};

export default ImportExcel;
