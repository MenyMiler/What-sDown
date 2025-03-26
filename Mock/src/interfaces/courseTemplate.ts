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
    unit: string;
    staffRatio?: number;
    courseSAPId?: string;
    profession?: string;
    networks?: string[];
}

export interface CourseTemplateDocument extends CourseTemplate {
    _id: string;
}
