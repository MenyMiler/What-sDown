import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Event, EventDocument, EventGantt, EventGanttFilters, PopulatedEvent } from '../interfaces/event';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class EventsService {
    private static api = createAxiosInstance(environment.api.events);

    static async getById<T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedEvent, EventDocument>> {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    }

    static async getByQuery<T extends boolean>(
        query: GetByQuery<Event, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedEvent[], EventDocument[]>> {
        const { data } = await this.api.get('/', { params: query });
        return data;
    }

    static createOne = async (event: Event): Promise<EventDocument> => {
        const { data } = await this.api.post('/', event);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Event>): Promise<EventDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<EventDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<EventDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };

    static eventGantt = async (baseId: string, query: Partial<EventGanttFilters>): Promise<EventGantt[]> => {
        const { data } = await this.api.get(`/${baseId}/event-gantt`, { params: query });
        return data;
    };
}
