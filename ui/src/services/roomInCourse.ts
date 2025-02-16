import { any } from 'bluebird';
import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { PopulatedRoomInCourse, RoomInCourse, RoomInCourseDocument, RoomOccupation } from '../interfaces/roomInCourse';
import { GetByQuery, ConditionalReturnType } from '../utils/types';
import { agGridResponse } from '../utils/agGrid';
import type { agGridRequest } from '../utils/agGrid';

export class RoomInCourseService {
    private static api = createAxiosInstance(environment.api.roomInCourse);

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<RoomInCourse, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedRoomInCourse[], RoomInCourseDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static async getSoldiersInRoomsCount(
        roomOfCourseIds: string[],
        startDate: Date,
        endDate: Date,
    ): Promise<{ roomId: string; currentCapacity: number }[]> {
        const { data } = await this.api.post('/soldiers-in-room/count', { roomOfCourseIds, startDate, endDate });
        return data;
    }

    static async createOne(roomInCourse: Partial<RoomInCourseDocument>): Promise<RoomInCourseDocument> {
        const { data } = await this.api.post('/', roomInCourse);
        return data;
    }

    static async deleteOne(roomId: string, courseId: string): Promise<RoomInCourseDocument> {
        const { data } = await this.api.delete(`/room/${roomId}/course/${courseId}`);
        return data;
    }

    static async updateOne(roomId: string, courseId: string, update: Partial<RoomInCourseDocument>): Promise<RoomInCourseDocument> {
        const { data } = await this.api.put(`/room/${roomId}/course/${courseId}`, update);
        return data;
    }

    static async getRoomInCourseById(roomId: string): Promise<RoomInCourseDocument> {
        const { data } = await this.api.get<RoomInCourseDocument>(`/${roomId}`);
        return data;
    }

    static searchRoomOccupation = async (agGridRequest: agGridRequest & { roomId: string }): Promise<agGridResponse<RoomOccupation>> => {
        const { data } = await this.api.post('/occupation', agGridRequest);
        return data;
    };

    static async editResourcesHelperFunction(roomId: string, courseIdOrEventId: string): Promise<any> {
        const { data } = await this.api.get<RoomInCourseDocument>('/edit-resources-helper-func', { params: { roomId, courseIdOrEventId } });
        return data;
    }
}
