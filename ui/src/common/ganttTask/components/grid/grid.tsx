/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { DateSetup } from '../../types/date-setup';
import { Task, ViewMode } from '../../types/public-types';
import { GridBody } from './grid-body';

export type GridProps = {
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

export const Grid: React.FC<GridProps> = (props) => {
    return (
        <g className="grid">
            <GridBody {...props} />
        </g>
    );
};
