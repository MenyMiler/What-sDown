import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { PopulatedFeedback } from '../interfaces/feedback';
import { FeedbackArchive, FeedbackArchiveDocument } from '../interfaces/feedback/archive';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class FeedbacksArchiveService {
    private static api = createAxiosInstance(environment.api.feedbacksArchive);

    static async getById<T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedFeedback, FeedbackArchiveDocument>> {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    }

    static async getByQuery<T extends boolean>(
        query: GetByQuery<FeedbackArchive, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedFeedback[], FeedbackArchiveDocument[]>> {
        const { data } = await this.api.get('/', { params: query });
        return data;
    }

    static createOne = async (feedbackArchive: FeedbackArchive): Promise<FeedbackArchiveDocument> => {
        const { data } = await this.api.post('/', feedbackArchive);
        return data;
    };

    static updateOne = async (id: string, update: Partial<FeedbackArchive>): Promise<FeedbackArchiveDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<FeedbackArchiveDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };
}
