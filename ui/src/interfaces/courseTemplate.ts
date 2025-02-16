import { BaseDocument } from './base';
import { BranchDocument } from './branch';
import { NetworkDocument } from './network';

export enum Types {
    PRE_ENLISTMENT = 'PRE_ENLISTMENT',
    PRE_ENLISTMENT_CONTINUE = 'PRE_ENLISTMENT_CONTINUE',
    BASIC = 'BASIC',
    BASIC_CONTINUE = 'BASIC_CONTINUE',
    ADVANCED = 'ADVANCED',
    FURTHER_EDUCATION = 'FURTHER_EDUCATION',
    COMMAND = 'COMMAND',
}

export interface CourseTemplate {
    baseId: String;
    branchId: String;
    name: string;
    type: Types;
    courseACAId: string;
    unit?: string | null;
    staffRatio?: number | null;
    courseSAPId?: string | null;
    profession?: string | null;
}

export interface CourseTemplateDocument extends CourseTemplate {
    _id: string;
}

export interface PopulatedCourseTemplate extends Omit<CourseTemplateDocument, 'baseId' | 'branchId'> {
    base: BaseDocument;
    branch: BranchDocument;
    networks: NetworkDocument[];
}
