export enum ViewMode {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    TwoWeek = 'TwoWeek',
}

export interface Task {
    startDate: Date;
    endDate: Date;
    customStart?: Date;
    customEnd?: Date;
}

const MONTH = 4 * 7;
const SIX_DAYS = 6;
const ONE_DAY = 1;
const SEVEN_DAYS = 7;

const areDatesEqual = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

const divideTasks = async <T extends Task>(task: T, endDate: Date, monthEndDate: Date): Promise<T[]> => {
    const customTask = { ...task }; // Make a copy to avoid modifying the original object
    const taskEnd = new Date(customTask.customEnd ?? customTask.endDate);
    const taskStart = new Date(customTask.customStart ?? customTask.startDate);

    if (taskEnd < taskStart || taskStart > monthEndDate) return [];

    if (taskEnd > endDate) {
        const newEndDate = new Date(endDate);

        while (taskStart > newEndDate && !areDatesEqual(taskStart, newEndDate)) newEndDate.setDate(newEndDate.getDate() + 7);

        const firstMiniTask = { ...customTask, customStart: new Date(newEndDate) };
        firstMiniTask.customStart.setDate(firstMiniTask.customStart.getDate() + ONE_DAY);

        const secondMiniTask = { ...customTask, customEnd: new Date(newEndDate) };
        newEndDate.setDate(newEndDate.getDate() + SEVEN_DAYS);

        const firstTasks = await divideTasks(firstMiniTask, newEndDate, monthEndDate);
        const secondTasks = await divideTasks(secondMiniTask, newEndDate, monthEndDate);
        return [...firstTasks, ...secondTasks];
    }

    return [customTask];
};

export const handleTaskView = async <T extends Task>(courses: T[], startDate: Date): Promise<T[]> => {
    const promises = courses.map(async (task) => {
        const adjustedTask = { ...task };
        if (new Date(adjustedTask.startDate) < startDate) adjustedTask.customStart = startDate;
        const tempEndDate = new Date(startDate);
        tempEndDate.setDate(tempEndDate.getDate() + SIX_DAYS);
        const monthEndDate = new Date(tempEndDate);
        monthEndDate.setDate(tempEndDate.getDate() + MONTH);

        if (adjustedTask.endDate > monthEndDate) adjustedTask.customEnd = new Date(monthEndDate);

        return divideTasks(adjustedTask, tempEndDate, monthEndDate);
    });

    const miniTasksArrays = (await Promise.all(promises)).flat();
    return miniTasksArrays;
};
