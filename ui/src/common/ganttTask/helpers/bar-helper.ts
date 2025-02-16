/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Promise from 'bluebird';
import { Task, ViewMode } from '../types/public-types';
import { BarTask, TaskTypeInternal } from '../types/bar-task';
import { BarMoveAction } from '../types/gantt-task-actions';
import { areDatesEqual } from '../../../utils/datePickers';

export const convertToBarTasks = (
    tasks: Task[][],
    dates: Date[],
    columnWidth: number,
    rowHeight: number,
    taskHeight: number,
    barCornerRadius: number,
    handleWidth: number,
    rtl: boolean,
    barBackgroundColor: string,
    barBackgroundSelectedColor: string,
    projectBackgroundColor: string,
    projectBackgroundSelectedColor: string,
    squareBackgroundColor: string,
    squareBackgroundSelectedColor: string,
    viewMode: ViewMode,
    filter: any,
) => {
    const dateDelta = dates[1].getTime() - dates[0].getTime() - dates[1].getTimezoneOffset() * 60 * 1000 + dates[0].getTimezoneOffset() * 60 * 1000;
    let barTasks =
        tasks.length === 1 && tasks[0][0] && tasks[0][0].type === 'bar'
            ? tasks.flat().map((t, i) => {
                  return convertToBarTask(
                      t,
                      i,
                      dates,
                      dateDelta,
                      columnWidth,
                      rowHeight,
                      taskHeight,
                      barCornerRadius,
                      handleWidth,
                      rtl,
                      barBackgroundColor,
                      barBackgroundSelectedColor,
                      projectBackgroundColor,
                      projectBackgroundSelectedColor,
                      squareBackgroundColor,
                      squareBackgroundSelectedColor,
                      viewMode,
                      tasks,
                      filter,
                  );
              })
            : tasks
                  .map((taskList, taskListIndex) => {
                      return taskList.map((task) => {
                          const { color } = task;
                          return convertToBarTask(
                              task,
                              taskListIndex,
                              dates,
                              dateDelta,
                              columnWidth,
                              rowHeight,
                              taskHeight,
                              barCornerRadius,
                              handleWidth,
                              rtl,
                              barBackgroundColor,
                              barBackgroundSelectedColor,
                              color! ?? projectBackgroundColor,
                              projectBackgroundSelectedColor,
                              squareBackgroundColor,
                              squareBackgroundSelectedColor,
                              viewMode,
                              tasks,
                              filter,
                          );
                      });
                  })
                  .flat();

    // set dependencies
    barTasks = barTasks.map((task) => {
        const dependencies = task.dependencies || [];
        // eslint-disable-next-line no-plusplus
        for (let j = 0; j < dependencies.length; j++) {
            const dependence = barTasks.findIndex((value) => value.id === dependencies[j]);
            if (dependence !== -1) barTasks[dependence].barChildren.push(task);
        }
        return task;
    });

    return barTasks;
};

const convertToBarTask = (
    task: Task,
    index: number,
    dates: Date[],
    dateDelta: number,
    columnWidth: number,
    rowHeight: number,
    taskHeight: number,
    barCornerRadius: number,
    handleWidth: number,
    rtl: boolean,
    barBackgroundColor: string,
    barBackgroundSelectedColor: string,
    projectBackgroundColor: string,
    projectBackgroundSelectedColor: string,
    squareBackgroundColor: string,
    squareBackgroundSelectedColor: string,
    viewMode: ViewMode,
    tasks: Task[][],
    filter: any,
): BarTask => {
    let barTask: BarTask;
    switch (task.type) {
        case 'project':
            barTask = convertToBar(
                task,
                index,
                dates,
                dateDelta,
                columnWidth,
                rowHeight,
                taskHeight,
                barCornerRadius,
                handleWidth,
                rtl,
                projectBackgroundColor,
                projectBackgroundSelectedColor,
                viewMode,
                tasks,
                filter,
            );
            break;
        case 'square':
            barTask = convertToBar(
                task,
                index,
                dates,
                dateDelta,
                columnWidth,
                rowHeight,
                taskHeight,
                barCornerRadius,
                handleWidth,
                rtl,
                squareBackgroundColor,
                squareBackgroundSelectedColor,
                viewMode,
                tasks,
                filter,
            );
            break;
        default:
            barTask = convertToBar(
                task,
                index,
                dates,
                dateDelta,
                columnWidth,
                rowHeight,
                taskHeight,
                barCornerRadius,
                handleWidth,
                rtl,
                barBackgroundColor,
                barBackgroundSelectedColor,
                viewMode,
                tasks,
                filter,
            );
            break;
    }
    return barTask;
};

const convertToBar = (
    task: Task,
    index: number,
    dates: Date[],
    dateDelta: number,
    columnWidth: number,
    rowHeight: number,
    taskHeight: number,
    barCornerRadius: number,
    handleWidth: number,
    rtl: boolean,
    barBackgroundColor: string,
    barBackgroundSelectedColor: string,
    viewMode: ViewMode,
    tasks: Task[][],
    filter: any,
): BarTask => {
    let x1: number;
    let x2: number;

    const differenceInDays = (date1: Date, date2: Date): number => {
        // Convert both dates to UTC to ensure accurate calculation
        const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

        // Calculate the difference in milliseconds
        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        const differenceInMilliseconds = utcDate2 - utcDate1;

        // Convert the difference in milliseconds to days and return it
        return Math.abs(differenceInMilliseconds / millisecondsPerDay);
    };

    const taskStart = task.customStart ? task.customStart : task.start;
    const taskEnd = task.customEnd ? task.customEnd : task.end;
    if (rtl) {
        if (dates.length <= 2) {
            x1 = 0;
            if (taskStart < dates[dates.length - 1]) x2 = columnWidth;
            else x2 = columnWidth * -1;
        } else if (viewMode === ViewMode.Month) {
            const taskStartDate = taskStart.getDate();
            const taskEndDate = taskEnd.getDate();
            let { startDate } = filter;

            if (!startDate) startDate = filter.monthValue ?? new Date(startDate.getFullYear(), startDate.getMonth(), 1);

            let taskDuration =
                taskEndDate === taskStartDate ? 1 : Math.ceil(Math.abs(taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            let columnIndex = 7 - (differenceInDays(taskStart, startDate) % 7);

            if (taskStart < startDate) {
                columnIndex = 6;
                taskDuration = task.end.getDay();
            }

            // special case where the diff in days is 1 and we are the first day of the week. need to set length from 1 to 2.
            if (task.end.getDay() - task.start.getDay() === 1 && (task.start.getDay() - startDate.getDay()) % 7 === 0) taskDuration = 2;

            columnIndex = Math.min(6, columnIndex);
            if (columnIndex !== 6 && task.type === 'bar') x2 = columnIndex * columnWidth;
            else if (task.type === 'project') x2 = (columnIndex + 1) * columnWidth;
            else x2 = (columnIndex + 1) * columnWidth;
            if (columnIndex === 6 && task.type === 'bar' && taskStartDate - startDate.getDate() === 1) x2 -= 195;
            x1 = Math.max(0, x2 - taskDuration * columnWidth);
            if (task.type === 'project' && taskDuration !== 1) {
                if (!task.customStart) x2 -= columnWidth;
                else if (x1 !== 0) x1 += columnWidth;
                else if (!task.customEnd) x1 += columnWidth;
            }
        } else {
            x2 =
                taskStart < dates[dates.length - 1]
                    ? taskXCoordinate(dates[dates.length - 1], dates, 2, columnWidth)
                    : taskXCoordinate(taskStart, dates, 2, columnWidth);

            x1 = task.end > dates[0] ? taskXCoordinate(dates[0], dates, 1, columnWidth) : taskXCoordinate(task.end, dates, 1, columnWidth);
        }
    } else {
        x1 = taskXCoordinate(taskStart, dates, 1, columnWidth);
        x2 = taskXCoordinate(task.end, dates, 2, columnWidth);
    }
    let typeInternal: TaskTypeInternal = task.type || 'task';
    if (typeInternal === 'task' && x2 - x1 < handleWidth * 2) {
        typeInternal = 'smalltask';
        x2 = x1 + handleWidth * 2;
    }

    const [progressWidth, progressX] = progressWithByParams(x1, x2, task.progress || 0, rtl);

    let y = 0;
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

        const taskStartDay = taskStart.getDate();
        const rowIndex = Math.round((taskStartDay - filter.startDate.getDate() + 1) / 7);

        let sameIndexCounter = 0;

        for (let taskIndex = 0; taskIndex < index; taskIndex++) {
            const currTask = tasks[0][taskIndex];

            for (let weekIndex = 0; weekIndex < 5; weekIndex++) {
                const currentWeekStartDate = new Date(filter.startDate);
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() + weekIndex * 7);
                const currentWeekEndDate = new Date(currentWeekStartDate);
                currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6);

                // if the task is in the current week and currTask is too, then increase the index.
                if (
                    (areDatesEqual(task.start, currentWeekStartDate) ||
                        areDatesEqual(task.start, currentWeekEndDate) ||
                        (task.start > currentWeekStartDate && task.start < currentWeekEndDate)) &&
                    (areDatesEqual(currTask.start, currentWeekStartDate) ||
                        areDatesEqual(currTask.start, currentWeekEndDate) ||
                        (currTask.start > currentWeekStartDate && currTask.start < currentWeekEndDate))
                ) {
                    sameIndexCounter++;
                    break;
                }
            }
        }

        y = taskYCoordinate(sameIndexCounter, rowHeight, taskHeight, viewMode);
    } else y = taskYCoordinate(index, rowHeight, taskHeight, viewMode);
    const hideChildren = task.type === 'project' ? task.hideChildren : undefined;

    const styles = {
        backgroundColor: barBackgroundColor,
        backgroundSelectedColor: barBackgroundSelectedColor,
        ...task.styles,
    };
    return {
        ...task,
        typeInternal,
        x1,
        x2,
        y,
        index,
        progressX,
        progressWidth,
        barCornerRadius,
        handleWidth,
        hideChildren,
        height: taskHeight,
        barChildren: [],
        styles,
    };
};

const taskXCoordinate = (xDate: Date, dates: Date[], cornorIndex: number, columnWidth: number) => {
    let x = -1;
    if (xDate <= dates[dates.length - 1]) {
        x = dates.length;
    } else if (xDate >= dates[0]) {
        x = 0;
    } else {
        for (let i = 0; i < dates.length; i++) {
            const currentDate = new Date(dates[i]);
            if (
                xDate.getFullYear() === currentDate.getFullYear() &&
                xDate.getMonth() === currentDate.getMonth() &&
                xDate.getDate() === currentDate.getDate()
            ) {
                x = cornorIndex === 1 ? i : i + 1;
                break;
            }
        }
    }

    return x * columnWidth;
};

const taskYCoordinate = (index: number, rowHeight: number, taskHeight: number, viewMode: ViewMode) => {
    const y = index * (viewMode === ViewMode.Month ? rowHeight / 4 : rowHeight) + (rowHeight - taskHeight) / 2;
    return y;
};

export const progressWithByParams = (taskX1: number, taskX2: number, progress: number, rtl: boolean) => {
    const progressWidth = (taskX2 - taskX1) * progress * 0.01;
    let progressX: number;
    if (rtl) {
        progressX = taskX2 - progressWidth;
    } else {
        progressX = taskX1;
    }
    return [progressWidth, progressX];
};

export const progressByProgressWidth = (progressWidth: number, barTask: BarTask) => {
    const barWidth = barTask.x2 - barTask.x1;
    const progressPercent = Math.round((progressWidth * 100) / barWidth);
    if (progressPercent >= 100) return 100;
    if (progressPercent <= 0) return 0;
    return progressPercent;
};

const progressByX = (x: number, task: BarTask) => {
    if (x >= task.x2) return 100;
    if (x <= task.x1) return 0;

    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth);
    return progressPercent;
};
const progressByXRTL = (x: number, task: BarTask) => {
    if (x >= task.x2) return 0;
    if (x <= task.x1) return 100;

    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((task.x2 - x) * 100) / barWidth);
    return progressPercent;
};

export const getProgressPoint = (progressX: number, taskY: number, taskHeight: number) => {
    const point = [progressX - 5, taskY + taskHeight, progressX + 5, taskY + taskHeight, progressX, taskY + taskHeight - 8.66];
    return point.join(',');
};

const startByX = (x: number, xStep: number, task: BarTask) => {
    if (x >= task.x2 - task.handleWidth * 2) {
        x = task.x2 - task.handleWidth * 2;
    }
    const steps = Math.round((x - task.x1) / xStep);
    const additionalXValue = steps * xStep;
    const newX = task.x1 + additionalXValue;
    return newX;
};

const endByX = (x: number, xStep: number, task: BarTask) => {
    if (x <= task.x1 + task.handleWidth * 2) {
        // eslint-disable-next-line no-param-reassign
        x = task.x1 + task.handleWidth * 2;
    }
    const steps = Math.round((x - task.x2) / xStep);
    const additionalXValue = steps * xStep;
    const newX = task.x2 + additionalXValue;
    return newX;
};

const moveByX = (x: number, xStep: number, task: BarTask) => {
    const steps = Math.round((x - task.x1) / xStep);
    const additionalXValue = steps * xStep;
    const newX1 = task.x1 + additionalXValue;
    const newX2 = newX1 + task.x2 - task.x1;
    return [newX1, newX2];
};

const dateByX = (x: number, taskX: number, taskDate: Date, xStep: number, timeStep: number) => {
    let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
    newDate = new Date(newDate.getTime() + (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000);
    return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
    svgX: number,
    action: BarMoveAction,
    selectedTask: BarTask,
    xStep: number,
    timeStep: number,
    initEventX1Delta: number,
    rtl: boolean,
): { isChanged: boolean; changedTask: BarTask } => {
    let result: { isChanged: boolean; changedTask: BarTask };
    switch (selectedTask.type) {
        default:
            result = handleTaskBySVGMouseEventForBar(svgX, action, selectedTask, xStep, timeStep, initEventX1Delta, rtl);
            break;
    }
    return result;
};

const handleTaskBySVGMouseEventForBar = (
    svgX: number,
    action: BarMoveAction,
    selectedTask: BarTask,
    xStep: number,
    timeStep: number,
    initEventX1Delta: number,
    rtl: boolean,
): { isChanged: boolean; changedTask: BarTask } => {
    const changedTask: BarTask = { ...selectedTask };
    let isChanged = false;
    switch (action) {
        case 'progress': {
            if (rtl) {
                changedTask.progress = progressByXRTL(svgX, selectedTask);
            } else {
                changedTask.progress = progressByX(svgX, selectedTask);
            }
            isChanged = changedTask.progress !== selectedTask.progress;
            if (isChanged) {
                const [progressWidth, progressX] = progressWithByParams(changedTask.x1, changedTask.x2, changedTask.progress, rtl);
                changedTask.progressWidth = progressWidth;
                changedTask.progressX = progressX;
            }
            break;
        }
        case 'start': {
            const newX1 = startByX(svgX, xStep, selectedTask);
            changedTask.x1 = newX1;
            isChanged = changedTask.x1 !== selectedTask.x1;
            if (isChanged) {
                if (rtl) {
                    changedTask.end = dateByX(newX1, selectedTask.x1, selectedTask.end, xStep, timeStep);
                } else {
                    changedTask.start = dateByX(newX1, selectedTask.x1, selectedTask.start, xStep, timeStep);
                }
                const [progressWidth, progressX] = progressWithByParams(changedTask.x1, changedTask.x2, changedTask.progress || 0, rtl);
                changedTask.progressWidth = progressWidth;
                changedTask.progressX = progressX;
            }
            break;
        }
        case 'end': {
            const newX2 = endByX(svgX, xStep, selectedTask);
            changedTask.x2 = newX2;
            isChanged = changedTask.x2 !== selectedTask.x2;
            if (isChanged) {
                if (rtl) {
                    changedTask.start = dateByX(newX2, selectedTask.x2, selectedTask.start, xStep, timeStep);
                } else {
                    changedTask.end = dateByX(newX2, selectedTask.x2, selectedTask.end, xStep, timeStep);
                    const [progressWidth, progressX] = progressWithByParams(changedTask.x1, changedTask.x2, changedTask.progress || 0, rtl);
                    changedTask.progressWidth = progressWidth;
                    changedTask.progressX = progressX;
                }
            }
            break;
        }
        case 'move': {
            const [newMoveX1, newMoveX2] = moveByX(svgX - initEventX1Delta, xStep, selectedTask);
            isChanged = newMoveX1 !== selectedTask.x1;
            if (isChanged) {
                changedTask.start = dateByX(newMoveX1, selectedTask.x1, selectedTask.start, xStep, timeStep);
                changedTask.end = dateByX(newMoveX2, selectedTask.x2, selectedTask.end, xStep, timeStep);
                changedTask.x1 = newMoveX1;
                changedTask.x2 = newMoveX2;
                const [progressWidth, progressX] = progressWithByParams(changedTask.x1, changedTask.x2, changedTask.progress || 0, rtl);
                changedTask.progressWidth = progressWidth;
                changedTask.progressX = progressX;
            }
            break;
        }
        default:
            break;
    }
    return { isChanged, changedTask };
};
