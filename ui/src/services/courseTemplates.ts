import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Networks } from '../interfaces/course';
import { CourseTemplate, CourseTemplateDocument, PopulatedCourseTemplate } from '../interfaces/courseTemplate';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class CourseTemplatesService {
    private static api = createAxiosInstance(environment.api.courseTemplates);

    static getById = async <T extends boolean>(
        id: string,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedCourseTemplate, CourseTemplateDocument>> => {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<CourseTemplate, T> & Networks = {},
    ): Promise<ConditionalReturnType<T, PopulatedCourseTemplate[], CourseTemplateDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async <T extends boolean>(
        courseTemplate: CourseTemplate & Networks,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedCourseTemplate, CourseTemplateDocument>> => {
        const { data } = await this.api.post('/', courseTemplate, { params: { populate } });
        return data;
    };

    static updateOne = async <T extends boolean>(
        id: string,
        update: Partial<CourseTemplate> & Networks,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedCourseTemplate, CourseTemplateDocument>> => {
        const { data } = await this.api.put(`/${id}`, update, { params: { populate } });
        return data;
    };

    static deleteOne = async <T extends boolean>(
        id: string,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedCourseTemplate, CourseTemplateDocument>> => {
        const { data } = await this.api.delete(`/${id}`, { params: { populate } });
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<CourseTemplateDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };
}
