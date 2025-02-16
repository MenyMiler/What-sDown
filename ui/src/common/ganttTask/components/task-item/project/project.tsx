import React from 'react';
import { TaskItemProps } from '../task-item';
import styles from './project.module.css';
import { ViewMode } from '../../../types/public-types';

export const Project: React.FC<TaskItemProps> = ({ rowHeight, viewMode, filter, task }) => {
    const projectWith = task.x2 - task.x1;
    let rowIndex = 0;
    let newBarHeight = task.height;

    if (viewMode === ViewMode.Month) {
        let { startDate } = filter;

        if (!startDate) startDate = filter.monthValue ?? new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        const currentDate = new Date(startDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 4 * 7); // Adding 5 weeks

        currentDate.setDate(currentDate.getDate() + 6);
        const dateArray = [new Date(currentDate)];
        while (currentDate <= endDate) {
            currentDate.setDate(currentDate.getDate() + 7);
            dateArray.push(new Date(currentDate));
        }

        for (let i = 0; i < dateArray.length; i++) {
            if (dateArray[i] > task.start) {
                rowIndex = i;
                break;
            }
        }

        newBarHeight /= 2.5;
    }

    return (
        <g tabIndex={0} className={styles.projectWrapper}>
            <rect
                fill={task.styles.backgroundColor}
                x={task.x1}
                width={projectWith}
                y={task.y * (viewMode === ViewMode.Month ? 1.15 : 1) + 7 + (rowHeight * rowIndex * 7) / 5}
                height={task.height}
                rx={task.barCornerRadius}
                ry={task.barCornerRadius}
                className={styles.projectBackground}
            />
        </g>
    );
};
