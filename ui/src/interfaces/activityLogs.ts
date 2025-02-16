/* v8 ignore start */

export enum ActivityTypes {
    COURSE = 'COURSE',
    EVENT = 'EVENT',
    ROOM_IN_COURSE = 'ROOM_IN_COURSE',
    ROOM_IN_EVENT = 'ROOM_IN_EVENT',
    SOLDIERS_IN_ROOM_IN_EVENT = 'SOLDIERS_IN_ROOM_IN_EVENT',
    SOLDIERS_IN_ROOM_IN_COURSE = 'SOLDIERS_IN_ROOM_IN_COURSE',
    EXCEL = 'EXCEL',
    PERMISSION = 'PERMISSION',
    COURSE_TEMPLATE = 'COURSE_TEMPLATE',
    REQUEST = 'REQUEST',
    SOLDIER_IN_EVENT = 'SOLDIER_IN_EVENT',
}

export enum ActionTypes {
    ADD = 'ADD',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
    ASSOCIATION = 'ASSOCIATION',
}

export interface Log extends LogDocument {
    name: string;
    userId: string;
    type: ActivityTypes;
    action: ActionTypes;
    metaData: Record<string, unknown>;
}

export interface LogDocument {
    _id?: string;
    createdAt: Date;
    updatedAt: Date;
}
