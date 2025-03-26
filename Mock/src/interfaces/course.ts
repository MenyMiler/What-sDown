import { CourseTemplate } from './courseTemplate';
import { Genders, SpecialGenders } from './soldier';
import { UserTypes } from './user';

export type SoldierAmounts = { [key in Genders]: number } & { [key in SpecialGenders]: number };

export interface Course extends CourseTemplate {
    startDate: Date;
    endDate: Date;
    year: number;
    userType: UserTypes;
    bootCamp: { startDate?: Date; endDate?: Date };
    durations: { rakaz: number; actual: number };
    receivanceDate?: Date;
    enlistmentDate?: Date;
    soldierAmounts: SoldierAmounts;
    networks?: string[];
}

export interface CourseDocument extends Course {
    _id: string;
}
