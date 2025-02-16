import { Types as CourseTypes } from '../courseTemplate';
import { RoomTypes } from '../room';
import { Genders, SpecialGenders } from '../soldier';
import { Types as UserTypes } from '../user';

export interface AddClassOrOfficeToCourseOrEventMetadata {
    eventId?: string;
    courseId?: string;
    amount: number;
    comments: string;
    type: RoomTypes.CLASS | RoomTypes.OFFICE;
    networkId?: string;
}

export interface addBedroomToCourseOrEventMetadataSchema {
    courseId?: string;
    eventId?: string;
    gender: Genders;
    amount: number;
}

export interface CreateEventMetadata {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    amount: number;
}

export interface NewEventRelatedToCourseMetadata {
    name: string;
    description: string;
    courseId: string;
    startDate: Date;
    endDate: Date;
    baseId: string;
    amount: number;
}

export interface ChangeDatesMetadata {
    courseId: string;
    newStartDate: Date;
    newEndDate: Date;
}

export interface EditSoldierAmountsInCourseRequestMetadata extends SoldierAmounts {
    courseId: string;
}

export type SoldierAmounts = { [key in Genders]: number } & { [key in SpecialGenders]: number };

export interface TransferSoldierAmountsRequestMetadata {
    courseId: string;
    destCourseId: string;
    soldierAmounts: SoldierAmounts;
    soldierAmountsDestCourse: SoldierAmounts;
}

export interface DeleteCourseMetadata {
    courseId: string;
}

export interface CreateTemplateMetadata {
    name: string;
    courseACAId: string;
    branchId: string;
    baseId: string;
    unit: string;
    profession?: string;
    courseSAPId?: string;
    staffRatio?: number;
    networkId: string;
    type: CourseTypes;
}

export interface CreateCourseMetadata extends CreateTemplateMetadata {
    startDate: Date;
    endDate: Date;
    bootCampStartDate?: Date;
    bootCampEndDate?: Date;
    year: number;
    RAKAZCourseDuration?: number;
    actualCourseDuration?: number;
    receivanceDate?: Date;
    enlistmentDate?: Date;
    soldierAmounts: Partial<Genders & SpecialGenders>;
}

export interface CreateCourseTemplateForMetadata {
    name: string;
    courseACAId: string;
    branchId: string;
    baseId: string;
    unit: string;
    profession?: string;
    courseSAPId?: string;
    staffRatio?: string;
    networkId: string;
    type: CourseTypes;
    requesterId: string;
    _isSavedInputValues: boolean;
    userType: string;
}

export interface PermissionRequestMetadata {
    currentUserType: UserTypes;
    requestedUserType: UserTypes;
}

export type metadataTypes =
    | addBedroomToCourseOrEventMetadataSchema
    | AddClassOrOfficeToCourseOrEventMetadata
    | CreateEventMetadata
    | ChangeDatesMetadata
    | EditSoldierAmountsInCourseRequestMetadata
    | TransferSoldierAmountsRequestMetadata
    | DeleteCourseMetadata
    | CreateCourseMetadata
    | CreateTemplateMetadata
    | NewEventRelatedToCourseMetadata
    | PermissionRequestMetadata;
