/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
import React, { ReactChild } from 'react';
import { addToDate, getLocalDayOfWeek } from '../../helpers/date-helper';
import { DateSetup } from '../../types/date-setup';
import { Task, ViewMode } from '../../types/public-types';
import styles from './grid.module.css';

export type GridBodyProps = {
    tasks: Task[][];
    dates: Date[];
    svgWidth: number;
    rowHeight: number;
    columnWidth: number;
    todayColor: string;
    rtl: boolean;
    viewMode: ViewMode;
    dateSetup: DateSetup;
    locale: string;
    headerHeight: number;
    filter: any;
};

export const GridBody: React.FC<GridBodyProps> = ({
    dateSetup,
    locale,
    headerHeight,
    tasks: allTasks,
    dates,
    rowHeight,
    svgWidth,
    columnWidth,
    todayColor,
    rtl,
    viewMode,
    filter,
}) => {
    const isGeneral = () => {
        return allTasks.length > 1;
    };

    let y = 0;
    const gridRows: ReactChild[] = [];
    const rowLines: ReactChild[] = [<line key="RowLineFirst" x="0" y1={0} x2={svgWidth} y2={0} className={styles.gridRowLine} />];

    const tasks = isGeneral() ? allTasks : allTasks.length === 0 ? [] : allTasks[0];

    let heightOfGraph = 6;
    let newRowHeight = rowHeight;

    const isMonth = viewMode === ViewMode.Month;

    if (isMonth) {
        heightOfGraph = 5;
        newRowHeight *= 7 / 5;
    }

    for (let index = 0; index < tasks.length; index++) {
        gridRows.push(
            <rect
                key={`Row${index}`}
                x="0"
                y={y}
                width={svgWidth}
                height={newRowHeight}
                className={isGeneral() ? styles.gridRowGeneral : styles.gridRow}
            />,
        );
        rowLines.push(
            <line key={`RowLine${index}`} x="0" y1={y + newRowHeight} x2={svgWidth} y2={y + newRowHeight} className={styles.gridRowLine} />,
        );
        y += newRowHeight;
    }

    if (tasks.length < heightOfGraph) {
        for (let index = tasks.length; index < heightOfGraph; index++) {
            gridRows.push(
                <rect
                    key={`Row${index}`}
                    x="0"
                    y={y}
                    width={svgWidth}
                    height={newRowHeight}
                    className={isGeneral() ? styles.gridRowGeneral : styles.gridRow}
                />,
            );
            rowLines.push(
                <line key={`RowLine${index}`} x="0" y1={y + newRowHeight} x2={svgWidth} y2={y + newRowHeight} className={styles.gridRowLine} />,
            );
            y += newRowHeight;
        }
    }

    const now = new Date();
    let tickX = 0;
    const ticks: ReactChild[] = [];
    let today: ReactChild = <rect />;

    const getToday = () => {
        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            ticks.push(<line key={date.getTime()} x1={tickX} y1={0} x2={tickX} y2={y} className={styles.gridTick} />);
            if (
                (i + 1 !== dates.length && date.getTime() < now.getTime() && dates[i + 1].getTime() >= now.getTime()) ||
                // if current date is last
                (i !== 0 &&
                    i + 1 === dates.length &&
                    date.getTime() < now.getTime() &&
                    addToDate(date, date.getTime() - dates[i - 1].getTime(), 'millisecond').getTime() >= now.getTime())
            ) {
                today = <rect x={tickX} y={0} width={columnWidth} height={y} fill={todayColor} />;
            }
            // rtl for today
            if (rtl && i + 1 !== dates.length && date.getTime() >= now.getTime() && dates[i + 1].getTime() < now.getTime()) {
                today = <rect x={tickX + columnWidth} y={0} width={columnWidth} height={y} fill={todayColor} />;
            }
            tickX += columnWidth;
        }
    };

    const getTodayForMonth = () => {
        let todayX = 0;
        let todayY = 0;
        let { startDate } = filter;

        if (!startDate) startDate = filter.monthValue ?? new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        if (now.getDate() === startDate.getDate() && now.getMonth() === startDate.getMonth()) todayX = 6 * columnWidth;
        else {
            const daysDifference = Math.ceil(Math.abs(now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

            todayX = (7 - (daysDifference % 7)) * columnWidth;
            if (daysDifference % 7 === 0) todayX = 0;

            let weekIndex = Math.floor(daysDifference / 7);
            if (daysDifference % 7 === 0) weekIndex--;
            todayY = (weekIndex * rowHeight * 7) / 5;
        }

        today = <rect x={todayX} y={todayY} width={columnWidth} height={(rowHeight * 7) / 5} fill={todayColor} />;

        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            ticks.push(<line key={date.getTime()} x1={tickX} y1={0} x2={tickX} y2={y} className={styles.gridTick} />);
            tickX += columnWidth;
        }
    };

    if (viewMode === ViewMode.Month) {
        getTodayForMonth();
    } else {
        getToday();
    }

    const labels: ReactChild[] = [];

    const getCalendarValuesForDay = () => {
        let { startDate } = filter;

        if (!startDate) startDate = filter.monthValue ?? new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        const bottomValues: ReactChild[] = [];
        const currentDate = new Date(startDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 5 * 7); // Adding 5 weeks

        while (currentDate <= endDate) {
            const bottomValue = `${getLocalDayOfWeek(currentDate, locale, 'short')}, 
            ${currentDate.getDate().toString()}`;

            bottomValues.push(bottomValue);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return bottomValues.map((item) => (item as string).split(', ')[1]);
    };

    if (isMonth) {
        const fontSize = 14; // Font size of the text
        const textColor = '#000000'; // Color of the text
        const calendarValues = getCalendarValuesForDay();
        let counter = 0;

        for (let i = 0; i < 5; i++) {
            const labelY = 20 + i * newRowHeight; // Calculate the y value based on the index and row height

            for (let j = 7; j > 0; j--) {
                const labelX = (j - 1) * columnWidth + columnWidth / 2; // Calculate the x value based on the index, column width, and add half of the column width

                labels.push(
                    <text
                        key={`Label${i}-${j}`}
                        x={labelX}
                        y={labelY}
                        fontSize={fontSize}
                        fill={textColor}
                        style={{ userSelect: 'none', caretColor: 'transparent' }}
                        textAnchor="middle" // Center the text horizontally
                    >
                        {calendarValues[counter]}
                    </text>,
                );
                counter++;
            }
        }
    }

    return (
        <g className="gridBody">
            <g className="rows">{gridRows}</g>
            <g className="rowLines">{rowLines}</g>
            <g className="ticks">{ticks}</g>
            <g className="today">{today}</g>
            {isMonth && labels}
        </g>
    );
};
