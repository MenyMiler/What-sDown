/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { convertToBarTasks } from '../../helpers/bar-helper';
import { ganttDateRange, seedDates } from '../../helpers/date-helper';
import { BarTask } from '../../types/bar-task';
import { DateSetup } from '../../types/date-setup';
import { GanttEvent } from '../../types/gantt-task-actions';
import { GanttProps, Task, ViewMode } from '../../types/public-types';
import { CalendarProps } from '../calendar/calendar';
import { GridProps } from '../grid/grid';
import { StandardTooltipContent, Tooltip } from '../other/tooltip';
import { TaskList, TaskListProps } from '../task-list/task-list';
import { TaskListHeaderDefault } from '../task-list/task-list-header';
import { TaskListTableDefault } from '../task-list/task-list-table';
import styles from './gantt.module.css';
import { TaskGantt } from './task-gantt';
import { TaskGanttContentProps } from './task-gantt-content';

const MONTH = 4 * 7;
const SIX_DAYS = 6;

export const Gantt: React.FunctionComponent<GanttProps> = ({
    tasks,
    headerHeight = 50,
    columnWidth = 60,
    listCellWidth = '155px',
    viewMode = ViewMode.Week,
    rowHeight = viewMode === ViewMode.Month ? 85.8 : 100,
    ganttHeight = rowHeight * (viewMode === ViewMode.Month ? 7 : 6),
    locale = 'he-IL',
    barFill = 60,
    barCornerRadius = 10,
    barBackgroundColor = '#ffffff',
    barBackgroundSelectedColor = '#dae1e8',
    projectBackgroundColor = '#E077AB',
    projectBackgroundSelectedColor = '#E077AB',
    squareBackgroundColor = '#E0777B',
    squareBackgroundSelectedColor = '#E07700',
    rtl = true,
    handleWidth = 8,
    timeStep = 300000,
    fontFamily = 'Assistant',
    fontSize = '14px',
    title = '',
    todayColor = 'rgba(211, 216, 227, 0.2)',
    viewDate,
    TooltipContent = StandardTooltipContent,
    TaskListHeader = TaskListHeaderDefault,
    TaskListTable = TaskListTableDefault,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onDelete,
    onSelect,
    onExpanderClick,
    editMode,
    resourcesItems = [],
    openModal = false,
    ganttStartDate = new Date(),
    ganttEndDate = new Date(),
    filter,
    ganttType = '',
    tasksLength = 0,
}) => {
    useEffect(() => {
        const newFilter = filter;
        let tempDate = new Date(filter.startDate);

        if (!tempDate) tempDate = new Date(filter.monthValue);
        if (!tempDate) tempDate = new Date();

        switch (filter.viewMode) {
            case ViewMode.Day:
                tempDate.setDate(tempDate.getDate() + 1);
                newFilter.endDate = tempDate;
                break;
            case ViewMode.TwoWeek:
                tempDate.setDate(tempDate.getDate() + 13);
                newFilter.endDate = tempDate;
                break;
            case ViewMode.Month:
                tempDate.setDate(tempDate.getDate() + 7 * 5 - 1);
                newFilter.endDate = tempDate;
                break;
            default:
                tempDate.setDate(tempDate.getDate() + 6);
                newFilter.endDate = tempDate;
                break;
        }
    }, [filter]);

    if (!tasks.length) tasks.push([]);

    tasks[0].filter((task: Task) => (task.customEnd ? task.customEnd > filter.startDate : task.end > filter.startDate));
    const wrapperRef = useRef<HTMLDivElement>(null);
    const taskListRef = useRef<HTMLDivElement>(null);
    const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
        const [startDate, endDate] = ganttDateRange(filter, tasks.flat(), ganttStartDate, ganttEndDate, viewMode);
        return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
    });
    const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(undefined);

    const [taskListWidth, setTaskListWidth] = useState(0);
    const [svgContainerWidth, setSvgContainerWidth] = useState(0);
    const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
    const [barTasks, setBarTasks] = useState<BarTask[]>([]);
    const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
        action: '',
    });
    const taskHeight = useMemo(() => (rowHeight * barFill) / 100, [rowHeight, barFill]);

    const [selectedTask, setSelectedTask] = useState<BarTask>();
    const [failedTask, setFailedTask] = useState<BarTask | null>(null);

    if (dateSetup.dates.length === 2) dateSetup.dates.shift();

    const svgWidth = (viewMode === ViewMode.Month ? 7 : dateSetup.dates.length) * columnWidth;
    let ganttFullHeight = tasks.length * rowHeight;

    const [scrollY, setScrollY] = useState(0);
    const [scrollX, setScrollX] = useState(-1);
    const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

    useEffect(() => {
        const updatedTasks = tasks[0];

        ganttFullHeight = tasks.length === 1 ? updatedTasks.length * rowHeight : tasks.length * rowHeight;

        const [startDate, endDate] = ganttDateRange(filter, updatedTasks, ganttStartDate, ganttEndDate, viewMode);
        let newDates = seedDates(startDate, endDate, viewMode);
        if (rtl) {
            newDates = newDates.reverse();

            if (scrollX === -1) {
                setScrollX(newDates.length * columnWidth);
            }
        }
        setDateSetup({ dates: newDates, viewMode });
        setBarTasks(
            convertToBarTasks(
                ganttType === 'bedroom' ? tasks : [updatedTasks],
                newDates,
                columnWidth,
                rowHeight,
                taskHeight,
                barCornerRadius,
                handleWidth,
                rtl,
                barBackgroundColor,
                barBackgroundSelectedColor,
                projectBackgroundColor,
                projectBackgroundSelectedColor,
                squareBackgroundColor,
                squareBackgroundSelectedColor,
                viewMode,
                filter,
            ),
        );
    }, [
        tasks,
        viewMode,
        rowHeight,
        barCornerRadius,
        columnWidth,
        taskHeight,
        handleWidth,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        rtl,
        scrollX,
        onExpanderClick,
    ]);

    useEffect(() => {
        if (viewMode === dateSetup.viewMode && ((viewDate && !currentViewDate) || (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))) {
            const { dates } = dateSetup;
            const index = dates.findIndex(
                (d, i) => viewDate.valueOf() >= d.valueOf() && i + 1 !== dates.length && viewDate.valueOf() < dates[i + 1].valueOf(),
            );
            if (index === -1) {
                return;
            }
            setCurrentViewDate(viewDate);
            setScrollX(columnWidth * index);
        }
    }, [viewDate, columnWidth, dateSetup.dates, viewMode, currentViewDate, setCurrentViewDate]);

    useEffect(() => {
        const { changedTask, action } = ganttEvent;
        if (changedTask) {
            if (action === 'delete') {
                setGanttEvent({ action: '' });
                setBarTasks(barTasks.filter((t) => t.id !== changedTask.id));
            } else if (action === 'move' || action === 'end' || action === 'start' || action === 'progress') {
                const prevStateTask = barTasks.find((t) => t.id === changedTask.id);
                if (
                    prevStateTask &&
                    (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
                        prevStateTask.end.getTime() !== changedTask.end.getTime() ||
                        prevStateTask.progress !== changedTask.progress)
                ) {
                    // actions for change
                    const newTaskList = barTasks.map((t) => (t.id === changedTask.id ? changedTask : t));
                    setBarTasks(newTaskList);
                }
            }
        }
    }, [ganttEvent, barTasks]);

    useEffect(() => {
        if (failedTask) {
            setBarTasks(barTasks.map((t) => (t.id !== failedTask.id ? t : failedTask)));
            setFailedTask(null);
        }
    }, [failedTask, barTasks]);

    useEffect(() => {
        if (!listCellWidth) {
            setTaskListWidth(0);
        }
        if (taskListRef.current) {
            setTaskListWidth(taskListRef.current.offsetWidth);
        }
    }, [taskListRef, listCellWidth]);

    useEffect(() => {
        if (wrapperRef.current) {
            setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
        }
    }, [wrapperRef, taskListWidth]);

    useEffect(() => {
        if (ganttHeight) {
            setSvgContainerHeight(ganttHeight + headerHeight);
        } else {
            setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
        }
    }, [ganttHeight, tasks]);

    /**
     * Handles arrow keys events and transform it to new scroll
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        let newScrollY = scrollY;
        let newScrollX = scrollX;
        let isX = true;
        switch (event.key) {
            case 'Down': // IE/Edge specific value
            case 'ArrowDown':
                newScrollY += rowHeight;
                isX = false;
                break;
            case 'Up': // IE/Edge specific value
            case 'ArrowUp':
                newScrollY -= rowHeight;
                isX = false;
                break;
            case 'Left':
            case 'ArrowLeft':
                newScrollX -= columnWidth;
                break;
            case 'Right': // IE/Edge specific value
            case 'ArrowRight':
                newScrollX += columnWidth;
                break;
            default:
                break;
        }
        if (isX) {
            if (newScrollX < 0) {
                newScrollX = 0;
            } else if (newScrollX > svgWidth) {
                newScrollX = svgWidth;
            }
            setScrollX(newScrollX);
        } else {
            if (newScrollY < 0) {
                newScrollY = 0;
            } else if (newScrollY > ganttFullHeight - ganttHeight) {
                newScrollY = ganttFullHeight - ganttHeight;
            }
            setScrollY(newScrollY);
        }
        setIgnoreScrollEvent(true);
    };

    /**
     * Task select event
     */
    const handleSelectedTask = (taskId: string) => {
        const newSelectedTask = barTasks.find((t) => t.id === taskId);

        if (onSelect && newSelectedTask) onSelect(newSelectedTask);

        setSelectedTask(newSelectedTask);
    };

    useEffect(() => {
        if (!openModal) setSelectedTask(undefined);
    }, [openModal]);

    const handleExpanderClick = (task: Task) => {
        if (onExpanderClick && task.hideChildren !== undefined) {
            onExpanderClick({ ...task, hideChildren: !task.hideChildren });
        }
    };

    const gridProps: GridProps = {
        columnWidth,
        svgWidth,
        tasks,
        rowHeight,
        dates: dateSetup.dates,
        todayColor,
        rtl,
        viewMode,
        locale,
        headerHeight,
        dateSetup,
        filter,
    };

    const calendarProps: CalendarProps = {
        dateSetup,
        locale,
        viewMode,
        headerHeight,
        columnWidth,
        fontFamily,
        fontSize,
        rtl,
        filter,
    };

    const barProps: TaskGanttContentProps = {
        tasks: barTasks,
        dates: dateSetup.dates,
        ganttEvent,
        selectedTask,
        rowHeight,
        taskHeight,
        columnWidth,
        timeStep,
        fontFamily,
        fontSize,
        svgWidth,
        rtl,
        setGanttEvent,
        setFailedTask,
        setSelectedTask: handleSelectedTask,
        onDateChange,
        onProgressChange,
        onDoubleClick,
        onDelete,
        editMode,
        viewMode,
        filter,
    };

    const tableProps: TaskListProps = {
        rowHeight,
        rowWidth: listCellWidth,
        fontFamily,
        fontSize,
        title,
        tasks: resourcesItems,
        locale,
        headerHeight,
        scrollY,
        ganttHeight,
        horizontalContainerClass: styles.horizontalContainer,
        selectedTask,
        taskListRef,
        setSelectedTask: handleSelectedTask,
        onExpanderClick: handleExpanderClick,
        TaskListHeader,
        TaskListTable,
        viewMode,
    };

    return (
        <div>
            <div className={styles.wrapper} onKeyDown={handleKeyDown} tabIndex={0} ref={wrapperRef}>
                {listCellWidth && <TaskList {...tableProps} />}
                <TaskGantt
                    gridProps={gridProps}
                    calendarProps={calendarProps}
                    barProps={barProps}
                    ganttHeight={ganttHeight}
                    viewMode={viewMode}
                    filter={filter}
                    tasksLength={tasksLength}
                />
                {ganttEvent.changedTask && ganttEvent.changedTask.type !== 'square' && (
                    <Tooltip
                        rowHeight={rowHeight}
                        svgContainerHeight={svgContainerHeight}
                        svgContainerWidth={svgContainerWidth}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        scrollX={scrollX}
                        scrollY={scrollY}
                        task={ganttEvent.changedTask}
                        headerHeight={headerHeight}
                        taskListWidth={taskListWidth}
                        TooltipContent={TooltipContent}
                        rtl={rtl}
                        svgWidth={svgWidth}
                        viewMode={viewMode}
                        filter={filter}
                    />
                )}
            </div>
        </div>
    );
};
