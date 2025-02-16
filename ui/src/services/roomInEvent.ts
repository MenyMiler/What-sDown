import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { RoomInEvent, RoomInEventDocument } from '../interfaces/roomInEvent';

export class RoomInEventService {
    private static api = createAxiosInstance(environment.api.roomInEvent);

    static async getSoldiersInRoomsCount(
        roomOfCourseIds: string[],
        startDate: Date,
        endDate: Date,
    ): Promise<{ roomId: string; currentCapacity: number }[]> {
        const { data } = await this.api.post('/soldiers-in-room/count', { roomOfCourseIds, startDate, endDate });
        return data;
    }

    static async createOne(roomInCourse: Partial<RoomInEvent>): Promise<RoomInEventDocument> {
        const { data } = await this.api.post('/', roomInCourse);
        return data;
    }

    static async deleteOne(roomId: string, eventId: string): Promise<RoomInEventDocument> {
        const { data } = await this.api.delete(`/room/${roomId}/event/${eventId}`);
        return data;
    }

    static async updateOne(roomId: string, eventId: string, update: Partial<RoomInEventDocument>): Promise<RoomInEventDocument> {
        const { data } = await this.api.put(`/room/${roomId}/event/${eventId}`, update);
        return data;
    }
}
