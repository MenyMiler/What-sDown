/* eslint-disable react/require-default-props */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Legend from '../../common/Legend';
import Sorts, { PageType } from '../../common/filterSelect';
import { Task, ViewMode } from '../../common/ganttTask';
import { Gantt } from '../../common/ganttTask/components/gantt/gantt';
import CourseDetails from '../../common/ganttTask/components/modal/CourseDetails';
import { environment } from '../../globals';
import { PopulatedCourse } from '../../interfaces/course';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';
import { getColumnWidth } from '../../utils/gantt';
import { convertDateTolocaleString } from '../../utils/today';
import { initTasks } from './helper';
import { Status } from '../../common/ganttTask/types/public-types';

const { colors } = environment;

export const uniqueArray = (arr: any[]): any[] => Array.from(new Set(arr));

interface CoursesGanttProps {
    miniGanttFlag?: boolean;
}

const CoursesGantt = ({ miniGanttFlag = false }: CoursesGanttProps) => {
    const [view, setView] = useState<ViewMode>(ViewMode.Week);
    const [courses, setCourses] = useState<Task[]>(initTasks());
    const [isChecked, _setIsChecked] = useState(false);
    const [filter, setFilter] = useState<any>({ viewMode: ViewMode.Week, editModeFilter: false });
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<PopulatedCourse>({} as PopulatedCourse);
    const [openModal, setOpenModal] = useState(false);
    const [changedTasks, setChangedTasks] = useState<Map<string, Task>>(new Map());
    const [filterToSend, setFilterToSend] = useState<any>({});

    const currentUser = useUserStore(({ user }) => user);

    const initFilters = () => {
        setFilter(({ startDate, endDate, editModeFilter }: any) => ({
            startDate,
            endDate,
            editModeFilter,
            viewMode: ViewMode.Week,
        }));
        setView(ViewMode.Week);
    };

    const getCourseStatus = (start: Date, end: Date) => {
        const today = new Date();
        if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) return Status.Active;
        if (today.getTime() > start.getTime()) return Status.Done;
        return Status.Future;
    };

    const updateCoursesDisplay = (task: Task) => {
        setCourses((prevCourses) =>
            prevCourses.map((course: Task) => {
                if (course.id === task.id) {
                    course.start = new Date(`${task.start}`);
                    course.end = new Date(`${task.end}`);
                    course.status = getCourseStatus(new Date(`${task.start}`), new Date(`${task.end}`));
                }
                return course;
            }),
        );
    };

    const changeTaskDates = async (task: Task) => {
        const isTheChangeValid = await CoursesService.canChangeDates(task.id, { startDate: task.start, endDate: task.end });

        if (!isTheChangeValid) {
            toast.error(i18next.t('requests.dateError'));
            return;
        }

        updateCoursesDisplay(task);

        const result = await CoursesService.updateOne(task.id, { startDate: task.start, endDate: task.end });

        toast.success(
            i18next.t('coursesGantt.changeDates', {
                name: task.title,
                startDate: convertDateTolocaleString(result.startDate),
                endDate: convertDateTolocaleString(result.endDate),
            }),
        );

        setChangedTasks((prev) => {
            prev.delete(task.id);
            return prev;
        });
    };

    const handleTaskChange = (task: Task) => {
        console.log(`On date change Id:${task.id}`);
        updateCoursesDisplay(task);
        setChangedTasks((prev) => prev.set(task.id, task));
    };

    const handleSelect = async (task: Task) => {
        const result = await CoursesService.getById(task.id, true);
        setSelectedCourse(result);
        setOpenModal(true);
    };

    const handleClose = () => setOpenModal(false);

    useEffect(() => {
        const { editModeFilter, ...rest } = filter;

        if (!_.isEqual(rest, filterToSend)) setFilterToSend(rest);
        if (!editModeFilter) Promise.all(Array.from(changedTasks.values()).map(changeTaskDates));

        setEditMode(editModeFilter as boolean);
        setView(filter.viewMode as ViewMode);
    }, [filter]);

    useEffect(() => {
        const getCourses = async () => {
            const gantt = await CoursesService.courseGantt(currentUser.baseId, filterToSend);
            setCourses(
                !gantt.length
                    ? []
                    : gantt.map((course) => {
                          const start = new Date(`${course.customStart ?? course.startDate}`);
                          const end = new Date(`${course.customEnd ?? course.endDate}`);
                          return {
                              start,
                              end,
                              title: course.name,
                              id: course._id,
                              status: getCourseStatus(new Date(course.startDate), new Date(course.endDate)),
                              subTitle: course.base,
                              type: 'bar',
                          };
                      }),
            );
        };
        if (filter.startDate && filter.endDate) getCourses();
    }, [filterToSend, currentUser.baseId!]);

    return (
        <Grid container direction="column" spacing={2} sx={{ width: '100%', ml: !miniGanttFlag ? '2.5%' : '' }}>
            {openModal && <CourseDetails populatedCourse={selectedCourse} open={openModal} handleClose={handleClose} />}
            {!miniGanttFlag ? (
                <Grid item>
                    <Sorts
                        setFilter={setFilter}
                        initFilters={initFilters}
                        filter={filter}
                        pageType={PageType.COURSE}
                        setChangedTasks={setChangedTasks}
                    />
                </Grid>
            ) : (
                <Grid item container direction="row" alignItems="center" gap={2}>
                    <Grid item>
                        <Sorts
                            setFilter={setFilter}
                            initFilters={initFilters}
                            filter={filter}
                            pageType={PageType.COURSE}
                            setChangedTasks={setChangedTasks}
                        />
                    </Grid>
                    <Grid item sx={{ width: '50%' }}>
                        <Box>
                            <Legend
                                items={[
                                    { dotColor: colors.coursesGantt.done, text: `${i18next.t('coursesGanttLegends.done')}` },
                                    { dotColor: colors.coursesGantt.active, text: `${i18next.t('coursesGanttLegends.active')}` },
                                    { dotColor: colors.coursesGantt.future, text: `${i18next.t('coursesGanttLegends.future')}` },
                                ]}
                                spacing="space-between"
                            />
                        </Box>
                    </Grid>
                </Grid>
            )}
            <Grid item sx={{ width: '100%' }}>
                <Gantt
                    tasks={[courses]}
                    viewMode={view}
                    onDateChange={handleTaskChange}
                    onSelect={handleSelect}
                    listCellWidth={isChecked ? '155px' : ''}
                    columnWidth={getColumnWidth(view)}
                    editMode={editMode}
                    openModal={openModal}
                    filter={filter}
                />
            </Grid>
            {!miniGanttFlag && (
                <Grid item>
                    <Box sx={{ width: '30%' }}>
                        <Legend
                            items={[
                                { dotColor: colors.coursesGantt.done, text: `${i18next.t('coursesGanttLegends.done')}` },
                                { dotColor: colors.coursesGantt.active, text: `${i18next.t('coursesGanttLegends.active')}` },
                                { dotColor: colors.coursesGantt.future, text: `${i18next.t('coursesGanttLegends.future')}` },
                            ]}
                            spacing="space-between"
                        />
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default CoursesGantt;
