import React from 'react';

export enum ViewMode {
    Hour = 'Hour',
    QuarterDay = 'Quarter Day',
    HalfDay = 'Half Day',
    Day = 'Day',
    /** ISO-8601 week */
    Week = 'Week',
    Month = 'Month',
    TwoWeek = 'TwoWeek',
    HalfYear = 'HalfYear',
    Year = 'Year',
}

export enum BedroomModes {
    All = 'All',
    Free = 'Free',
    Occupied = 'Occupied',
}

export type TaskType = 'task' | 'project' | 'square' | 'bar';
export type TaskStatus = 'active' | 'future' | 'done';

export interface Task {
    bedroomId?: string;
    id: string;
    type?: TaskType;
    title: string;
    start: Date;
    end: Date;
    color?: string;
    /**
     * From 0 to 100
     */
    progress?: number;
    styles?: {
        backgroundColor?: string;
        backgroundSelectedColor?: string;
        progressColor?: string;
        progressSelectedColor?: string;
        opacity?: string;
    };
    isDisabled?: boolean;
    project?: string;
    dependencies?: string[];
    hideChildren?: boolean;
    displayOrder?: number;
    status: string;
    subTitle?: string;
    child?: any;
    branch?: any;
    customStart?: Date;
    customEnd?: Date;
    location?: string;
    building?: string;
    floor?: string;
    soldiersOccupation?: number;
    maxCapacity?: number;
    occupation?: number;
}

export interface EventOption {
    /**
     * Time step value for date changes.
     */
    timeStep?: number;
    /**
     * Invokes on bar select on unselect.
     */
    onSelect?: (task: Task) => void;
    /**
     * Invokes on bar double click.
     */
    onDoubleClick?: (task: Task) => void;
    /**
     * Invokes on end and start time change. Chart undoes operation if method return false or error.
     */
    onDateChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>;
    /**
     * Invokes on progress change. Chart undoes operation if method return false or error.
     */
    onProgressChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>;
    /**
     * Invokes on delete selected task. Chart undoes operation if method return false or error.
     */
    onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
    /**
     * Invokes on expander on task list
     */
    onExpanderClick?: (task: Task) => void;

    editMode: boolean;
}

export interface DisplayOption {
    viewMode?: ViewMode;
    viewDate?: Date;
    /**
     * Specifies the month name language. Able formats: ISO 639-2, Java Locale
     */
    locale?: string;
    rtl?: boolean;
}

export interface StylingOption {
    headerHeight?: number;
    columnWidth?: number;
    listCellWidth?: string;
    rowHeight?: number;
    ganttHeight?: number;
    barCornerRadius?: number;
    handleWidth?: number;
    fontFamily?: string;
    fontSize?: string;
    title?: string;
    /**
     * How many of row width can be taken by task.
     * From 0 to 100
     */
    barFill?: number;
    barProgressColor?: string;
    barProgressSelectedColor?: string;
    barBackgroundColor?: string;
    barBackgroundSelectedColor?: string;
    projectProgressColor?: string;
    projectProgressSelectedColor?: string;
    projectBackgroundColor?: string;
    projectBackgroundSelectedColor?: string;
    squareBackgroundColor?: string;
    squareBackgroundSelectedColor?: string;
    arrowColor?: string;
    arrowIndent?: number;
    todayColor?: string;
    TooltipContent?: React.FC<{
        task: Task;
        fontSize: string;
        fontFamily: string;
    }>;
    TaskListHeader?: React.FC<{
        headerHeight: number;
        rowWidth: string;
        fontFamily: string;
        fontSize: string;
        title: string;
    }>;
    TaskListTable?: React.FC<{
        rowHeight: number;
        rowWidth: string;
        fontFamily: string;
        fontSize: string;
        locale: string;
        tasks: Task[];
        selectedTaskId: string;
        /**
         * Sets selected task by id
         */
        setSelectedTask: (taskId: string) => void;
        onExpanderClick: (task: Task) => void;
    }>;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
    tasks: Task[][];
    resourcesItems?: Task[];
    openModal?: boolean;
    ganttStartDate?: Date;
    ganttEndDate?: Date;
    filter?: any;
    ganttType?: string;
    tasksLength?: number;
}

export enum Status {
    Active = 'active',
    Future = 'future',
    Done = 'done',
    ExtraCourses = 'extraCourses',
}
