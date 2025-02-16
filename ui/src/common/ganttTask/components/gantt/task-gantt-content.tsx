/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-expressions */
import { Dialog, DialogContent, DialogTitle, List, ListItem } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { SoldierDocument } from '../../../../interfaces/soldier';
import { CoursesService } from '../../../../services/courses';
import { handleTaskBySVGMouseEvent } from '../../helpers/bar-helper';
import { isKeyboardEvent } from '../../helpers/other-helper';
import { BarTask } from '../../types/bar-task';
import { BarMoveAction, GanttContentMoveAction, GanttEvent } from '../../types/gantt-task-actions';
import { EventOption, TaskType, ViewMode } from '../../types/public-types';
import { TaskItem } from '../task-item/task-item';
import { RoomsService } from '../../../../services/rooms';

export type TaskGanttContentProps = {
    tasks: BarTask[];
    dates: Date[];
    ganttEvent: GanttEvent;
    selectedTask: BarTask | undefined;
    rowHeight: number;
    columnWidth: number;
    timeStep: number;
    svg?: React.RefObject<SVGSVGElement>;
    svgWidth: number;
    taskHeight: number;
    fontSize: string;
    fontFamily: string;
    rtl: boolean;
    setGanttEvent: (value: GanttEvent) => void;
    setFailedTask: (value: BarTask | null) => void;
    setSelectedTask: (taskid: string) => void;
    viewMode: ViewMode;
    filter: any;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
    tasks,
    dates,
    ganttEvent,
    selectedTask,
    columnWidth,
    timeStep,
    svg,
    taskHeight,
    fontFamily,
    fontSize,
    rtl,
    setGanttEvent,
    setFailedTask,
    setSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onDelete,
    editMode,
    viewMode,
    rowHeight,
    filter,
}) => {
    const point = svg?.current?.createSVGPoint();
    const [xStep, setXStep] = useState(0);
    const [initEventX1Delta, setInitEventX1Delta] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [soldiers, setSoldiers] = useState<SoldierDocument[]>([]);

    // create xStep
    useEffect(() => {
        const dateDelta =
            (dates.length !== 1 ? dates[1].getTime() - dates[0].getTime() - dates[1].getTimezoneOffset() * 60 * 1000 : 0) +
            dates[0].getTimezoneOffset() * 60 * 1000;
        const newXStep = (timeStep * columnWidth) / dateDelta;
        setXStep(newXStep);
    }, [columnWidth, timeStep]);

    useEffect(() => {
        const handleMouseMove = async (event: MouseEvent) => {
            if (!ganttEvent.changedTask || !point || !svg?.current) return;
            event.preventDefault();

            point.x = event.clientX;
            const cursor = point.matrixTransform(svg?.current.getScreenCTM()?.inverse());
            const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
                cursor.x,
                ganttEvent.action as BarMoveAction,
                ganttEvent.changedTask,
                xStep,
                timeStep,
                initEventX1Delta,
                rtl,
            );
            if (isChanged) {
                setGanttEvent({ action: ganttEvent.action, changedTask });
            }
        };

        const handleMouseUp = async (event: MouseEvent) => {
            const { action, originalSelectedTask, changedTask } = ganttEvent;
            if (!changedTask || !point || !svg?.current || !originalSelectedTask) return;
            event.preventDefault();

            point.x = event.clientX;
            const cursor = point.matrixTransform(svg?.current.getScreenCTM()?.inverse());
            const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
                cursor.x,
                action as BarMoveAction,
                changedTask,
                xStep,
                timeStep,
                initEventX1Delta,
                rtl,
            );

            const isNotLikeOriginal =
                originalSelectedTask.start !== newChangedTask.start ||
                originalSelectedTask.end !== newChangedTask.end ||
                originalSelectedTask.progress !== newChangedTask.progress;

            // remove listeners
            svg.current.removeEventListener('mousemove', handleMouseMove);
            svg.current.removeEventListener('mouseup', handleMouseUp);
            setGanttEvent({ action: '' });
            setIsMoving(false);

            // custom operation start
            let operationSuccess = true;
            if ((action === 'move' || action === 'end' || action === 'start') && onDateChange && isNotLikeOriginal) {
                try {
                    const result = await onDateChange(newChangedTask, newChangedTask.barChildren);
                    if (result !== undefined) {
                        operationSuccess = result;
                    }
                } catch (error) {
                    operationSuccess = false;
                }
            } else if (onProgressChange && isNotLikeOriginal) {
                try {
                    const result = await onProgressChange(newChangedTask, newChangedTask.barChildren);
                    if (result !== undefined) {
                        operationSuccess = result;
                    }
                } catch (error) {
                    operationSuccess = false;
                }
            }

            // If operation is failed - return old state
            if (!operationSuccess) {
                setFailedTask(originalSelectedTask);
            }
        };

        if (
            !isMoving &&
            (ganttEvent.action === 'move' || ganttEvent.action === 'end' || ganttEvent.action === 'start' || ganttEvent.action === 'progress') &&
            svg?.current
        ) {
            svg.current.addEventListener('mousemove', handleMouseMove);
            svg.current.addEventListener('mouseup', handleMouseUp);
            setIsMoving(true);
        }
    }, [ganttEvent, xStep, initEventX1Delta, onProgressChange, timeStep, onDateChange, svg, isMoving]);

    /**
     * Method is Start point of task change
     */
    const handleBarEventStart = async (action: GanttContentMoveAction, task: BarTask, event?: React.MouseEvent | React.KeyboardEvent) => {
        if (!event) {
            if (action === 'select' && ganttEvent.action === 'mouseenter') {
                setSelectedTask(task.id);
            }
        }
        // Keyboard events
        else if (isKeyboardEvent(event)) {
            if (action === 'delete') {
                if (onDelete) {
                    try {
                        const result = await onDelete(task);
                        if (result !== undefined && result) {
                            setGanttEvent({ action, changedTask: task });
                        }
                    } catch (error) {
                        console.error(`Error on Delete. ${error}`);
                    }
                }
            }
        }
        // Mouse Events
        else if (action === 'mouseenter') {
            if (!ganttEvent.action) {
                setGanttEvent({
                    action,
                    originalSelectedTask: task,
                });
            }
        } else if (action === 'mouseleave') {
            if (ganttEvent.action === 'mouseenter') {
                setGanttEvent({ action: '' });
            }
        } else if (action === 'dblclick') {
            !!onDoubleClick && onDoubleClick(task);
        }
        // Change task event start
        else if (action === 'move') {
            if (!svg?.current || !point) return;
            point.x = event.clientX;
            const cursor = point.matrixTransform(svg.current.getScreenCTM()?.inverse());
            setInitEventX1Delta(cursor.x - task.x1);
            setGanttEvent({
                action,
                changedTask: task,
                originalSelectedTask: task,
            });
        } else {
            setGanttEvent({
                action,
                changedTask: task,
                originalSelectedTask: task,
            });
        }
    };

    const displaySoldiersNames = async (task: BarTask) => {
        const bedroomGantt: TaskType = 'square';

        if (task.typeInternal === bedroomGantt) {
            setOpen(true);
            const soldiersInRoomByDate = await RoomsService.getSoldiersInRoomByDate({ roomId: task.bedroomId!, date: task.start });
            setSoldiers(soldiersInRoomByDate);
        }
    };

    return (
        <g className="content">
            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle fontWeight="bold">{i18next.t(`bedroomsGantt.${soldiers.length ? 'soldiersNames' : 'bedroomIsEmpty'}`)}</DialogTitle>
                {soldiers.length ? (
                    <DialogContent>
                        <List>
                            {soldiers.map((soldier) => (
                                <ListItem key={soldier._id}>{soldier.name}</ListItem>
                            ))}
                        </List>
                    </DialogContent>
                ) : null}
            </Dialog>
            <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
                {(filter.monthValue || filter.startDate) &&
                    tasks.map((task, index) => {
                        const customTask = task;
                        if (task.y === 95 && viewMode === ViewMode.Month) {
                            customTask.status = 'extraCourses';
                            customTask.x2 = 7 * columnWidth;
                            customTask.x1 = 0;
                        }
                        return (
                            <g key={index} onClick={() => displaySoldiersNames(task)}>
                                <TaskItem
                                    task={customTask}
                                    taskHeight={taskHeight}
                                    isProgressChangeable={!!onProgressChange && !task.isDisabled && false}
                                    isDateChangeable={!!onDateChange && !task.isDisabled && editMode}
                                    isDelete={!task.isDisabled && editMode}
                                    onEventStart={handleBarEventStart}
                                    key={index}
                                    isSelected={!!selectedTask && task.id === selectedTask.id}
                                    rtl={rtl}
                                    viewMode={viewMode}
                                    rowHeight={rowHeight}
                                    filter={filter}
                                    tasks={tasks}
                                    index={index}
                                    columnWidth={columnWidth}
                                />
                            </g>
                        );
                    })}
            </g>
        </g>
    );
};
