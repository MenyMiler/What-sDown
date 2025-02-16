/* eslint-disable no-unused-expressions */
import React from 'react';
import { Status, ViewMode } from '../../../types/public-types';
import { TaskItemProps } from '../task-item';
import { BarDateHandle } from './bar-date-handle';
import { BarDisplay } from './bar-display';
import styles from './bar.module.css';
import { areDatesEqual } from '../../../../../utils/datePickers';

const MAX_TASK_WIDTH = 1371;

export const Bar: React.FC<TaskItemProps> = ({ filter, task, isDateChangeable, onEventStart, isSelected, viewMode, rowHeight, isExtraCourses }) => {
    const handleHeight = task.height - 2;
    let rowIndex = 0;
    let newBarHeight = task.height;

    if (viewMode === ViewMode.Month) {
        let { startDate } = filter;

        if (!startDate) startDate = filter.monthValue ?? new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const taskStart = task.start;

        const currentDate = new Date(startDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 4 * 7); // Adding 5 weeks

        currentDate.setDate(currentDate.getDate() + 6);
        const dateArray = [new Date(currentDate)];

        while (currentDate <= endDate) {
            currentDate.setDate(currentDate.getDate() + 7);
            dateArray.push(new Date(currentDate));
        }

        rowIndex = dateArray.findIndex((date) => date > taskStart || areDatesEqual(date, taskStart));

        newBarHeight /= 2.5;
    }

    const newTask = task;
    if (isExtraCourses) {
        newTask.x1 = 0;
        newTask.x2 = MAX_TASK_WIDTH;
        newTask.status = Status.ExtraCourses;
    }

    return (
        <g className={styles.barWrapper} tabIndex={0}>
            <BarDisplay
                x={newTask.x1}
                y={newTask.y * (viewMode === ViewMode.Month ? 1.15 : 1) + 7 + (rowHeight * rowIndex * 7) / 5 - 3}
                width={newTask.x2 - newTask.x1}
                height={newBarHeight - 3}
                barCornerRadius={newTask.barCornerRadius}
                styles={newTask.styles}
                isSelected={isSelected}
                status={newTask.status as Status}
                onMouseDown={(e) => {
                    if (isDateChangeable) onEventStart('move', newTask, e);
                }}
                task={newTask}
            />

            {/* DISABLED CHANGE DATE BUTTONS */}
            <g className="handleGroup">
                {isDateChangeable && false && (
                    <g>
                        {/* left */}
                        <BarDateHandle
                            x={newTask.x1 + 1}
                            y={newTask.y + 1}
                            width={newTask.handleWidth}
                            height={handleHeight}
                            barCornerRadius={newTask.barCornerRadius}
                            onMouseDown={(e) => {
                                onEventStart('start', newTask, e);
                            }}
                        />
                        {/* right */}
                        <BarDateHandle
                            x={newTask.x2 - newTask.handleWidth - 1}
                            y={newTask.y + 1}
                            width={newTask.handleWidth}
                            height={handleHeight}
                            barCornerRadius={newTask.barCornerRadius}
                            onMouseDown={(e) => {
                                onEventStart('end', newTask, e);
                            }}
                        />
                    </g>
                )}
            </g>
        </g>
    );
};
