import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Feedback, FeedbackDocument, PopulatedFeedback } from '../interfaces/feedback';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class FeedbacksService {
    private static api = createAxiosInstance(environment.api.feedbacks);

    static async getById<T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedFeedback, FeedbackDocument>> {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    }

    static async getByQuery<T extends boolean>(
        query: GetByQuery<Feedback, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedFeedback[], FeedbackDocument[]>> {
        const { data } = await this.api.get('/', { params: query });
        return data;
    }

    static createOne = async (feedback: Feedback): Promise<FeedbackDocument> => {
        const { data } = await this.api.post('/', feedback);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Feedback>): Promise<FeedbackDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<FeedbackDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static moveToArchive = async (feedbackId: string): Promise<FeedbackDocument> => {
        const { data } = await this.api.put(`/move/${feedbackId}/to-archive`);
        return data;
    };

    static getBackFromArchive = async (feedbackId: string) => {
        const { data } = await this.api.put(`/get/${feedbackId}/from-archive`);
        return data;
    };

    static getPercentageByRating = async (): Promise<{ _id: number; count: number; percentage: number }[]> => {
        const { data } = await this.api.get('/percentage-by-rating');
        return data;
    };

    static getFrequentCategory = async (): Promise<{ _id: string; count: number }> => {
        const { data } = await this.api.get('/frequent-category');
        return data;
    };
}
