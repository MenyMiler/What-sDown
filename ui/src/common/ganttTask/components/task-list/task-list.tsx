/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import React, { useEffect, useRef } from 'react';
import { BarTask } from '../../types/bar-task';
import { Task, ViewMode } from '../../types/public-types';

export type TaskListProps = {
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    title: string;
    rowHeight: number;
    ganttHeight: number;
    scrollY: number;
    locale: string;
    tasks: Task[];
    taskListRef: React.RefObject<HTMLDivElement>;
    horizontalContainerClass?: string;
    selectedTask: BarTask | undefined;
    setSelectedTask: (task: string) => void;
    onExpanderClick: (task: Task) => void;
    TaskListHeader: React.FC<{
        headerHeight: number;
        rowWidth: string;
        fontFamily: string;
        fontSize: string;
        title: string;
    }>;
    TaskListTable: React.FC<{
        rowHeight: number;
        rowWidth: string;
        fontFamily: string;
        fontSize: string;
        locale: string;
        tasks: Task[];
        selectedTaskId: string;
        setSelectedTask: (taskId: string) => void;
        onExpanderClick: (task: Task) => void;
        viewMode: ViewMode;
    }>;
    viewMode: ViewMode;
};

export const TaskList: React.FC<TaskListProps> = ({
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    rowHeight,
    title,
    scrollY,
    tasks,
    selectedTask,
    setSelectedTask,
    onExpanderClick,
    locale,
    ganttHeight,
    taskListRef,
    horizontalContainerClass,
    TaskListHeader,
    TaskListTable,
    viewMode,
}) => {
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (horizontalContainerRef.current) {
            horizontalContainerRef.current.scrollTop = scrollY;
        }
    }, [scrollY]);

    const headerProps = {
        headerHeight,
        fontFamily,
        fontSize,
        rowWidth,
        title,
    };
    const selectedTaskId = selectedTask ? selectedTask.id : '';
    const tableProps = {
        rowHeight,
        rowWidth,
        fontFamily,
        fontSize,
        tasks,
        locale,
        selectedTaskId,
        setSelectedTask,
        onExpanderClick,
        viewMode,
    };

    return (
        <div ref={taskListRef} style={{ boxShadow: '-5px 0px 15px #00000017' }}>
            <TaskListHeader {...headerProps} />
            <div ref={horizontalContainerRef} className={horizontalContainerClass} style={ganttHeight ? { height: ganttHeight } : {}}>
                <TaskListTable {...tableProps} />
            </div>
        </div>
    );
};
