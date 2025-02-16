/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-bitwise */
import i18next from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { BarTask } from '../../types/bar-task';
import { Task, ViewMode } from '../../types/public-types';
import styles from './tooltip.module.css';

export type TooltipProps = {
    task: BarTask;
    rtl: boolean;
    svgContainerHeight: number;
    svgContainerWidth: number;
    svgWidth: number;
    headerHeight: number;
    taskListWidth: number;
    scrollX: number;
    scrollY: number;
    rowHeight: number;
    fontSize: string;
    fontFamily: string;
    TooltipContent: React.FC<{
        task: Task;
        fontSize: string;
        fontFamily: string;
    }>;
    viewMode: ViewMode;
    filter: any;
};
export const Tooltip: React.FC<TooltipProps> = ({
    task,
    rowHeight,
    rtl,
    svgContainerHeight,
    svgContainerWidth,
    scrollX,
    scrollY,
    fontSize,
    fontFamily,
    headerHeight,
    taskListWidth,
    TooltipContent,
    viewMode,
    filter,
}) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [relatedY, setRelatedY] = useState(0);
    const [relatedX, setRelatedX] = useState(0);
    useEffect(() => {
        if (tooltipRef.current) {
            const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
            const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

            let rowIndex = 0;
            const taskStart = task.start.getDate();

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
                    if (dateArray[i].getDate() > taskStart) {
                        rowIndex = i;
                        break;
                    }
                }
            }

            let newRelatedY = task.y + 7 + (rowHeight * rowIndex * 7) / 5;
            let newRelatedX: number;

            if (rtl) {
                newRelatedX = task.x1 - tooltipWidth - scrollX;
                if (newRelatedX < 0) newRelatedX = task.x2 - scrollX;
                const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
                if (tooltipLeftmostPoint > svgContainerWidth) newRelatedX = svgContainerWidth - tooltipWidth;
            } else {
                newRelatedX = task.x2 + taskListWidth - scrollX;
                const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
                const fullChartWidth = taskListWidth + svgContainerWidth;
                if (tooltipLeftmostPoint > fullChartWidth) newRelatedX = task.x1 + taskListWidth - scrollX - tooltipWidth;
                if (newRelatedX < taskListWidth) newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
                newRelatedY += rowHeight;
            }

            const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
            if (tooltipLowerPoint > svgContainerHeight - scrollY) {
                newRelatedY = svgContainerHeight - tooltipHeight;
            }
            setRelatedY(newRelatedY);
            setRelatedX(newRelatedX);
        }
    }, [tooltipRef.current, task, scrollX, scrollY, headerHeight, taskListWidth, rowHeight, svgContainerHeight, svgContainerWidth]);

    return (
        <div
            ref={tooltipRef}
            className={relatedX ? styles.tooltipDetailsContainer : styles.tooltipDetailsContainerHidden}
            style={{ left: relatedX, top: relatedY }}
        >
            <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
        </div>
    );
};

export const StandardTooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
    const style = {
        fontSize,
        fontFamily,
    };
    return (
        <div className={styles.tooltipDefaultContainer} style={style}>
            <b style={{ fontSize: fontSize + 6 }}>{`${task.end.getDate()}/${
                task.end.getMonth() + 1
            }/${task.end.getFullYear()} - ${task.start.getDate()}/${task.start.getMonth() + 1}/${task.start.getFullYear()} `}</b>
            {task.end.getTime() - task.start.getTime() !== 0 && (
                <p className={styles.tooltipDefaultContainerParagraph}>{`${i18next.t('tooltip.duration')}: ${~~(
                    (task.end.getTime() - task.start.getTime()) /
                    (1000 * 60 * 60 * 24)
                )} ${i18next.t('tooltip.days')}`}</p>
            )}

            <p className={styles.tooltipDefaultContainerParagraph} />
            {!!task.progress && `Progress: ${task.progress} %`}
        </div>
    );
};
