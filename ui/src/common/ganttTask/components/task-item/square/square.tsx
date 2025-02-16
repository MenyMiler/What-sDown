import React from 'react';
import { TaskItemProps } from '../task-item';
import styles from './square.module.css';

export const Square: React.FC<TaskItemProps> = ({ filter, index, task, isSelected, taskHeight, isHoverEffect, columnWidth }) => {
    const barColor = isHoverEffect ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
    const taskStartDate = task.start;
    const { startDate } = filter;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 14);

    const calculateXposition = () => {
        const startIndex = startDate.getTime();
        const taskIndex = taskStartDate.getTime();
        const timeDiff = Math.abs(taskIndex - startIndex);
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return 13 - daysDiff;
    };

    return (
        <g tabIndex={0} className={styles.squareWrapper}>
            <rect
                fill={barColor}
                fillOpacity={task.styles.opacity}
                x={columnWidth * calculateXposition()}
                width={taskHeight - 1}
                y={task.y}
                height={taskHeight - 1}
                className={styles.squareBackground}
            />
        </g>
    );
};
