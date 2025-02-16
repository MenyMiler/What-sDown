import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import {
    Course,
    CourseData,
    CourseDocument,
    CourseGantt,
    CourseGanttFilters,
    CoursesQuery,
    CustomCourseGantt,
    PopulatedCourse,
    RecruitGantt,
} from '../interfaces/course';
import { NetworkDocument } from '../interfaces/network';
import { NetworkConnectionDocument } from '../interfaces/networkInCourse';
import { SoldierDocument } from '../interfaces/soldier';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery, RecursivePartial } from '../utils/types';

export class CoursesService {
    private static api = createAxiosInstance(environment.api.courses);

    static getById = async <T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedCourse, CourseDocument>> => {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<CoursesQuery, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedCourse[], CourseDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static getCurrentAmount = async (baseId?: string): Promise<number> => {
        const { data } = await this.api.get('/count/current', { params: { baseId } });
        return data;
    };

    static createOne = async <T extends boolean>(
        course: CourseData,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedCourse, CourseDocument>> => {
        const { data } = await this.api.post('/', course, { params: { populate } });
        return data;
    };

    static createBulk = async <T extends boolean>(
        courses: (Omit<Course, 'baseId'> & { baseName: string })[],
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedCourse[], CourseDocument[]>> => {
        const { data } = await this.api.post('/bulk', { courses }, { params: { populate } });
        return data;
    };

    static updateOne = async (id: string, update: RecursivePartial<CourseData>): Promise<CourseDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async <T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedCourse, CourseDocument>> => {
        const { data } = await this.api.delete(`/${id}`, { params: { populate } });
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<CourseDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };

    static canChangeDates = async (id: string, query?: Pick<Course, 'startDate' | 'endDate'>): Promise<boolean> => {
        const { data } = await this.api.get(`/${id}/can-change-dates`, { params: query });
        return data;
    };

    static courseGantt = async (baseId: string, courseGanttFilters: Partial<CourseGanttFilters>): Promise<CustomCourseGantt[]> => {
        const { data } = await this.api.get(`/${baseId}/course-gantt`, { params: courseGanttFilters });
        return data;
    };

    static recruitGantt = async (baseId: string): Promise<RecruitGantt[]> => {
        const { data } = await this.api.get(`/${baseId}/recruit-gantt`);
        return data;
    };

    static getNetworks = async <T extends boolean>(
        id: string,
        populate?: boolean,
    ): Promise<ConditionalReturnType<T, NetworkConnectionDocument[], NetworkDocument[]>> => {
        const { data } = await this.api.get(`/${id}/networks`, { params: { populate } });
        return data;
    };

    static getSoldiersByCoursesIds = async (courseIds: string[]): Promise<SoldierDocument[]> => {
        const { data } = await this.api.post('/soldiers', { courseIds });
        return data;
    };
}
