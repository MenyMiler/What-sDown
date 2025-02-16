import { BaseDocument } from '../base';
import { KartoffelUser } from '../kartoffel';
import { NetworkDocument } from '../network';
import { metadataTypes } from './metadata';

export enum RequestStatuses {
    PENDING = 'PENDING',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}

export enum RequestTypes {
    NEW_CLASS = 'NEW_CLASS',
    NEW_OFFICE = 'NEW_OFFICE',
    ADD_SOLDIER_BEDROOM_TO_COURSE = 'ADD_SOLDIER_BEDROOM_TO_COURSE',
    ADD_STAFF_BEDROOM_TO_COURSE = 'ADD_STAFF_BEDROOM_TO_COURSE',
    NEW_EVENT_RELATED_TO_COURSE = 'NEW_EVENT_RELATED_TO_COURSE',
    NEW_EVENT = 'NEW_EVENT',
    NEW_CLASS_TO_EVENT = 'NEW_CLASS_TO_EVENT',
    NEW_OFFICE_TO_EVENT = 'NEW_OFFICE_TO_EVENT',
    ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE = 'ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE',
    ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE = 'ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE',
    EDIT_SOLDIERS_AMOUNT = 'EDIT_SOLDIERS_AMOUNT',
    TRANSFER_SOLDIERS_AMOUNT = 'TRANSFER_SOLDIERS_AMOUNT',
    CHANGE_DATES = 'CHANGE_DATES',
    NEW_COURSE_TEMPLATE = 'NEW_COURSE_TEMPLATE',
    NEW_COURSE = 'NEW_COURSE',
    DELETE_COURSE = 'DELETE_COURSE',
    PERMISSION = 'PERMISSION',
}

export enum RequestsTypesCategories {
    RESOURCE_REQUESTS = 'RESOURCE_REQUESTS',
    CHANGE_COURSE_DETAILS = 'CHANGE_COURSE_DETAILS',
    NEW_COURSE_REQUESTS = 'NEW_COURSE_REQUESTS',
    OTHER_REQUESTS = 'OTHER_REQUESTS',
}

export const RequestsTypesByCategory: Record<RequestsTypesCategories, RequestTypes[]> = {
    [RequestsTypesCategories.RESOURCE_REQUESTS]: [
        RequestTypes.NEW_CLASS,
        RequestTypes.NEW_OFFICE,
        RequestTypes.ADD_SOLDIER_BEDROOM_TO_COURSE,
        RequestTypes.ADD_STAFF_BEDROOM_TO_COURSE,
        RequestTypes.NEW_CLASS_TO_EVENT,
        RequestTypes.NEW_OFFICE_TO_EVENT,
        RequestTypes.ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE,
        RequestTypes.ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE,
    ],
    [RequestsTypesCategories.CHANGE_COURSE_DETAILS]: [
        RequestTypes.EDIT_SOLDIERS_AMOUNT,
        RequestTypes.CHANGE_DATES,
        RequestTypes.TRANSFER_SOLDIERS_AMOUNT,
    ],
    [RequestsTypesCategories.NEW_COURSE_REQUESTS]: [
        RequestTypes.NEW_COURSE_TEMPLATE,
        RequestTypes.NEW_COURSE,
        RequestTypes.DELETE_COURSE,
        RequestTypes.NEW_EVENT_RELATED_TO_COURSE,
    ],
    [RequestsTypesCategories.OTHER_REQUESTS]: [RequestTypes.PERMISSION, RequestTypes.NEW_EVENT],
};

export interface Request<metadataType = metadataTypes> {
    approverId?: String;
    baseId: string;
    requesterId: string;
    status: RequestStatuses;
    type: RequestTypes;
    metaData: metadataType;
}

export interface RequestDocument<metadataType = metadataTypes> extends Request<metadataType> {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PopulatedRequest<metadataType = metadataTypes> extends Omit<RequestDocument<metadataType>, 'requesterId' | 'baseId'> {
    user: KartoffelUser;
    base: BaseDocument;
    network?: NetworkDocument;
}

export interface RequestsTableData {
    requestId: string;
    requestType: RequestTypes;
    courseOrEventName: string;
    startDate?: Date;
    endDate?: Date;
    requesterName: string;
    baseName: string;
    branch: { _id: string; name: string };
    requestStatus: RequestStatuses;
}
