import React from 'react';
import { environment } from '../../../../../globals';
import style from './bar.module.css';
import { Status } from '../../../types/public-types';
import { BarTask } from '../../../types/bar-task';

const { colors } = environment;

type BarDisplayProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    isSelected: boolean;
    /* progress start point */
    barCornerRadius: number;
    status: Status;
    styles: {
        backgroundColor: string;
        backgroundSelectedColor: string;
    };
    task: BarTask;
    onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({ x, y, width, height, isSelected, barCornerRadius, styles, onMouseDown, status, task }) => {
    // const getProcessColor = () => {
    //     return isSelected ? styles.progressSelectedColor : styles.progressColor;
    // };

    const getBarColor = () => {
        return isSelected && task && task.gantt !== 'general' ? styles.backgroundSelectedColor : styles.backgroundColor;
    };

    return (
        <g onMouseDown={onMouseDown}>
            <rect />
            <rect
                x={x}
                width={width}
                y={y}
                height={height}
                ry={barCornerRadius}
                rx={barCornerRadius}
                fill={getBarColor()}
                className={style.barBackground}
            />
            {/* <rect x={progressX} width={progressWidth} y={y} height={height} ry={barCornerRadius} rx={barCornerRadius} fill={getProcessColor()} /> */}
            <rect
                x={x + width - 16}
                width="1rem"
                y={y}
                height={height}
                ry={barCornerRadius}
                rx={barCornerRadius}
                fill={colors.coursesGantt[status]}
            />
            <rect x={x + width - 16} width="0.5rem" y={y} height={height} fill={colors.coursesGantt[status]} />
        </g>
    );
};
