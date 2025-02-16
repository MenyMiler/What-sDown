/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import { ViewMode } from '../../types/public-types';
import { Calendar, CalendarProps } from '../calendar/calendar';
import { Grid, GridProps } from '../grid/grid';
import styles from './gantt.module.css';
import { TaskGanttContent, TaskGanttContentProps } from './task-gantt-content';

const DEFAULT_GANTT_LENGTH = 6;

export type TaskGanttProps = {
    gridProps: GridProps;
    calendarProps: CalendarProps;
    barProps: TaskGanttContentProps;
    ganttHeight: number;
    viewMode: ViewMode;
    filter: any;
    tasksLength: number;
};

export const TaskGantt: React.FC<TaskGanttProps> = ({ filter, gridProps, calendarProps, barProps, ganttHeight, viewMode, tasksLength }) => {
    const ganttSVGRef = useRef<SVGSVGElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
    const newBarProps = { ...barProps, svg: ganttSVGRef };
    const { rowHeight, tasks } = barProps;
    const taskLength = tasks.length < DEFAULT_GANTT_LENGTH ? DEFAULT_GANTT_LENGTH : tasks.length;
    const type = barProps?.tasks[0]?.type || '';
    const isTypeSquare = type === 'square';
    const isMonth = filter.viewMode === ViewMode.Month || isTypeSquare;

    return (
        <div className={styles.ganttVerticalContainer} ref={verticalGanttContainerRef} dir="ltr" style={{ boxShadow: '-5px 0px 15px #00000017' }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={(isMonth ? 0 : 10) + gridProps.svgWidth}
                height={calendarProps.headerHeight}
                fontFamily={barProps.fontFamily}
            >
                <Calendar {...calendarProps} filter={filter} />
            </svg>
            <div style={ganttHeight && !isTypeSquare ? { height: ganttHeight, overflow: 'auto' } : {}}>
                <div
                    ref={horizontalContainerRef}
                    className={styles.horizontalContainer}
                    style={
                        ganttHeight
                            ? { height: isMonth ? ganttHeight : taskLength * rowHeight, width: gridProps.svgWidth, backgroundColor: 'white' }
                            : { width: gridProps.svgWidth }
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={gridProps.svgWidth}
                        height={isTypeSquare ? barProps.rowHeight * tasksLength : '100%'}
                        fontFamily={barProps.fontFamily}
                        ref={ganttSVGRef}
                    >
                        <Grid {...gridProps} {...calendarProps} viewMode={viewMode} filter={filter} />
                        <TaskGanttContent {...newBarProps} viewMode={viewMode} filter={filter} />
                    </svg>
                </div>
            </div>
        </div>
    );
};
