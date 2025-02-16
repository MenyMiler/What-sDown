/* eslint-disable no-plusplus */
import { Task } from '../../common/ganttTask';

export function initTasks(): Task[][] {
    return [[]];
}

export function initTasksItems(): Task[] {
    return [];
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
    const projectTasks = tasks.filter((t) => t.project === projectId);
    let { start } = projectTasks[0];
    let { end } = projectTasks[0];

    for (let i = 0; i < projectTasks.length; i++) {
        const task = projectTasks[i];
        if (start.getTime() > task.start.getTime()) {
            start = task.start;
        }
        if (end.getTime() < task.end.getTime()) {
            end = task.end;
        }
    }
    return [start, end];
}
