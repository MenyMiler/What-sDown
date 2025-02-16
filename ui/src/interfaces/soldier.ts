export enum SoldierTypes {
    STUDENT = 'STUDENT',
    STAFF = 'STAFF',
}

export enum SpecialStudentTypes {
    REGULAR = 'REGULAR',
    VOLUNTEERS = 'VOLUNTEERS',
    RESERVISTS = 'RESERVISTS',
    GOLDEN_PARACHUTES = 'GOLDEN_PARACHUTES',
    FALLEN = 'FALLEN',
    TRAJECTORY_REVERSALS = 'TRAJECTORY_REVERSALS',
    RESERVATION_FOR_OTHER_ARMIES = 'RESERVATION_FOR_OTHER_ARMIES',
    SECONDARY_PLACEMENT = 'SECONDARY_PLACEMENT',
    RESERVATION_FOR_THE_TRANSPARENT_UNITS = 'RESERVATION_FOR_THE_TRANSPARENT_UNITS',
}

export enum Genders {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER_MALE = 'OTHER_MALE',
    OTHER_FEMALE = 'OTHER_FEMALE',
}

export enum SpecialGenders {
    SPECIAL_MALE = 'SPECIAL_MALE',
    SPECIAL_FEMALE = 'SPECIAL_FEMALE',
    SPECIAL_OTHER_MALE = 'SPECIAL_OTHER_MALE',
    SPECIAL_OTHER_FEMALE = 'SPECIAL_OTHER_FEMALE',
}

export enum SoldierAssociation {
    COURSE = 'COURSE',
    EVENT = 'EVENT',
}

export const AllGenders = [...Object.values(Genders), ...Object.values(SpecialGenders)];

export interface Soldier {
    name: string;
    personalNumber: string;
    gender: Genders;
    soldierType: SoldierTypes;
    studentType: SpecialStudentTypes;
    exceptional: boolean;
}

export interface SoldierDocument extends Soldier {
    _id: string;
}

export interface SoldierWithCourseId extends SoldierDocument {
    courseId: string;
}
