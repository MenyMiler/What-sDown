/* eslint-disable react/require-default-props */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import i18next from 'i18next';
import { BarTask } from '../../types/bar-task';
import { GanttContentMoveAction } from '../../types/gantt-task-actions';
import { ViewMode } from '../../types/public-types';
import { Project } from './project/project';
import { Square } from './square/square';
import style from './task-list.module.css';
import { Bar } from './bar/bar';
import { areDatesEqual } from '../../../../utils/datePickers';

export type TaskItemProps = {
    task: BarTask;
    taskHeight: number;
    isProgressChangeable: boolean;
    isDateChangeable: boolean;
    isDelete: boolean;
    isSelected: boolean;
    rtl: boolean;
    onEventStart: (action: GanttContentMoveAction, selectedTask: BarTask, event?: React.MouseEvent | React.KeyboardEvent) => any;
    isHoverEffect?: boolean;
    viewMode: ViewMode;
    rowHeight: number;
    filter: any;
    tasks: BarTask[];
    index: number;
    columnWidth: number;
    isExtraCourses?: boolean;
};

export const TaskItem: React.FC<TaskItemProps> = (props) => {
    const { task, columnWidth, index, tasks, filter, rowHeight, viewMode, isDelete, taskHeight, isSelected, rtl, onEventStart } = {
        ...props,
    };

    const textRef = useRef<SVGTextElement>(null);
    const [taskItem, setTaskItem] = useState<any>(<div />);
    const [isTextInside, setIsTextInside] = useState(true);
    const [hoverEffect, setHoverEffect] = useState(false);
    const isMonthView = viewMode === ViewMode.Month;

    let rowIndex = -1;
    let { startDate } = filter;
    let currentDate = new Date(startDate);
    let endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 4 * 7); // Adding 5 weeks

    currentDate.setDate(currentDate.getDate() + 6);
    let dateArray = [new Date(currentDate)];
    while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 7);
        dateArray.push(new Date(currentDate));
    }

    const taskStart = task.start;

    let indexDate: Date;
    if (isMonthView) {
        rowIndex = dateArray.findIndex((date) => date > taskStart || areDatesEqual(date, taskStart));
        indexDate = currentDate;
        indexDate.setDate(indexDate.getDate() - 6);
    }

    const calculateTotalTasks = () => {
        startDate = filter.startDate;
        currentDate = new Date(startDate);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 4 * 7); // Adding 5 weeks

        currentDate.setDate(currentDate.getDate() + 6);
        dateArray = [new Date(currentDate)];
        while (currentDate <= endDate) {
            currentDate.setDate(currentDate.getDate() + 7);
            dateArray.push(new Date(currentDate));
        }

        let tasksAtSameIndexCounter = 0;

        for (let j = 0; j < tasks.length; j++) {
            const currTask = tasks[j];
            for (let i = 0; i < dateArray.length; i++) {
                if (dateArray[i] > currTask.start) {
                    if (i === rowIndex) tasksAtSameIndexCounter++;
                    break;
                }
            }
        }
        return tasksAtSameIndexCounter;
    };

    useEffect(() => {
        switch (task.typeInternal) {
            case 'project':
                setTaskItem(<Project {...props} />);
                break;
            case 'square':
                setTaskItem(<Square {...props} isHoverEffect={hoverEffect} />);
                break;
            default:
                setTaskItem(<Bar {...props} index={index} />);
                break;
        }
    }, [task, isSelected, hoverEffect]);

    useEffect(() => {
        if (textRef.current) {
            const padding = task.typeInternal === 'bar' ? 30 : 0;
            setIsTextInside(textRef.current.getBBox().width < task.x2 - padding - task.x1);
        }
    }, [textRef, task]);

    const getX = () => {
        if (areDatesEqual(task.start, filter.endDate) && task.type === 'square') {
            task.x2 = 0;
        }
        const width = task.x2 - task.x1;
        if (isTextInside) {
            return task.x1 + width * 0.5;
        }
        if (rtl && textRef.current) {
            return task.x1 - 6;
        }
        return task.x1 + width;
    };

    const getTextStyle = (): CSSProperties => {
        // courses gantt
        if (task.typeInternal === 'bar') return { fill: 'black' };

        // bedrooms gantt
        if (task.typeInternal === 'square') return { fill: 'white' };

        // facilities gantt
        if (task.typeInternal === 'project') return isTextInside ? { fill: 'white' } : { fill: 'black' };

        return { fill: 'white' };
    };

    const handleExtraCoursesClick = () => {
        const newFilter = { ...filter, viewMode: ViewMode.Week, startDate: indexDate };
        // need to check how to pass filter backwords. or how to submit new filter.
    };

    return (Math.ceil(task.y) <= 81 && isMonthView) || !isMonthView || !startDate ? (
        <g
            onKeyDown={(e) => {
                if (e.key === 'Delete') {
                    if (isDelete) onEventStart('delete', task, e);
                }
                e.stopPropagation();
            }}
            onMouseEnter={(e) => {
                if (task.typeInternal === 'square') setHoverEffect(true);
                onEventStart('mouseenter', task, e);
            }}
            onMouseLeave={(e) => {
                if (task.typeInternal === 'square') setHoverEffect(false);
                onEventStart('mouseleave', task, e);
            }}
            onDoubleClick={(e) => {
                onEventStart('dblclick', task, e);
            }}
            onFocus={(e) => {
                onEventStart('select', task);
                e.target.blur();
            }}
        >
            {taskItem}
            {task.typeInternal !== 'square' ? (
                <text
                    x={getX()}
                    y={
                        !startDate
                            ? task.y * (viewMode === ViewMode.Month ? 2.4 : 1) +
                              7 +
                              (viewMode === ViewMode.Day
                                  ? index === 0
                                      ? (rowHeight * 0.25 * 6) / 5
                                      : (rowHeight * index * 6) / 5
                                  : (rowHeight * (4 - index) * 7) / 5)
                            : isMonthView
                            ? task.y * 1.15 + 17 + (rowHeight * rowIndex * 7) / 5 - 4
                            : task.typeInternal === 'bar'
                            ? task.y + taskHeight * 0.3
                            : task.y + taskHeight * 0.5
                    }
                    className={isTextInside ? style.barLabel : style.barLabel && style.barLabelOutside}
                    ref={textRef}
                    style={getTextStyle()}
                >
                    {task.title}
                </text>
            ) : null}

            {task.typeInternal !== 'project' && task.subTitle && (
                <text
                    x={isMonthView ? getX() - 110 : task.typeInternal === 'square' ? getX() + 50 : getX()}
                    y={
                        isMonthView
                            ? task.y * 1.15 + 17 + (rowHeight * rowIndex * 7) / 5 - 4
                            : task.typeInternal === 'square'
                            ? task.y + taskHeight * 0.5
                            : task.y + taskHeight * 0.7
                    }
                    className={style.barLabel}
                    ref={textRef}
                    style={{ fontWeight: 'lighter' }}
                >
                    {task.subTitle}
                </text>
            )}
        </g>
    ) : Math.ceil(task.y) === 82 && isMonthView ? (
        <g onClick={handleExtraCoursesClick}>
            <Bar {...props} index={index} isExtraCourses />
            <text
                x={isMonthView ? getX() - 20 : getX()}
                y={isMonthView ? task.y * 1.15 + 16 + (rowHeight * rowIndex * 7) / 5 - 4 : task.y * 1.15 + taskHeight * 0.7}
                className={isTextInside ? style.barLabel : style.barLabel && style.barLabelOutside}
                ref={textRef}
                style={{ fontWeight: 'lighter' }}
            >
                {`${i18next.t('common.extraCourses')} ${calculateTotalTasks() - 3}`}
            </text>
        </g>
    ) : null;
};
