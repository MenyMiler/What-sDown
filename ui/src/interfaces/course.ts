import { ViewMode } from '../common/ganttTask';
import { RecursivePartial } from '../utils/types';
import { BaseDocument } from './base';
import { BranchDocument } from './branch';
import { CourseTemplate } from './courseTemplate';
import { NetworkDocument } from './network';
import { RoomWithSoldiers } from './room';
import { Genders, SoldierDocument, SpecialGenders } from './soldier';
import { Types } from './user';

export type SoldierAmounts = { [key in Genders]: number } & { [key in SpecialGenders]: number };

export interface Course extends CourseTemplate {
    startDate: Date;
    endDate: Date;
    year?: number | null;
    userType: Types;
    bootCamp: { startDate?: Date | null; endDate?: Date | null };
    durations: { rakaz?: number | null; actual?: number | null };
    receivanceDate?: Date | null;
    enlistmentDate?: Date | null;
    soldierAmounts: SoldierAmounts;
}

export interface CourseDocument extends Course {
    _id: string;
}

export interface PopulatedCourse extends Omit<CourseDocument, 'baseId' | 'branchId'> {
    base: BaseDocument;
    branch: BranchDocument;
    networks: NetworkDocument[];
    rooms: RoomWithSoldiers[];
    currentSoldierAmounts: Record<Genders, number>;
}

export type Networks = { networks?: string[] };

export type CoursesQuery = RecursivePartial<Course> & Networks & { sort?: string; order?: 1 | -1 };

export type CourseData = Omit<Course, 'bootCamp' | 'durations' | 'soldierAmounts'> & {
    bootCamp?: Partial<Course['bootCamp']>;
    durations?: Partial<Course['durations']>;
    soldierAmounts?: Partial<Course['soldierAmounts']>;
} & Networks;

export interface CourseGantt {
    _id: string;
    branch: string;
    branchId: string;
    base: string;
    baseId: string;
    startDate: Date;
    endDate: Date;
    name: string;
}

export interface CustomCourseGantt extends CourseGantt {
    customStart?: Date;
    customEnd?: Date;
    viewMode?: ViewMode;
}

export type CourseGanttFilters = Partial<Pick<CustomCourseGantt, 'startDate' | 'endDate' | 'viewMode'>>;

export enum Months {
    January = 'January',
    February = 'February',
    March = 'March',
    April = 'April',
    May = 'May',
    June = 'June',
    July = 'July',
    August = 'August',
    September = 'September',
    October = 'October',
    November = 'November',
    December = 'December',
}
export interface RecruitGantt {
    title: Months;
    startDate: Date;
    endDate: Date;
    amount: number;
}
