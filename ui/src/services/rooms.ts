import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Genders, Room, RoomDocument, RoomTypes, RoomWithCapacity } from '../interfaces/room';
import { SoldierDocument } from '../interfaces/soldier';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { GetByQuery } from '../utils/types';

export interface RoomWithCapacityRequest {
    courseId: string;
    roomType: RoomTypes;
    isStaff: boolean;
    areaId: string;
    buildingId: string;
    gender: Genders;
    network: string;
    branch: string;
    step: number;
    limit: number;
}

export class RoomsService {
    private static api = createAxiosInstance(environment.api.rooms);

    private static apiOfRoomInCourse = createAxiosInstance(environment.api.roomInCourse);

    static getById = async (id: string): Promise<RoomDocument> => {
        const { data } = await this.api.get(`/${id}`);
        return data;
    };

    static getByQuery = async (query: GetByQuery<Room> = {}): Promise<RoomDocument[]> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (room: Room): Promise<RoomDocument> => {
        const { data } = await this.api.post('/', room);
        return data;
    };

    static createBulk = async (rooms: Room[]): Promise<RoomDocument[]> => {
        const { data } = await this.api.post('/bulk', rooms);
        return data;
    };

    static createFromExcel = async (
        rooms: (Omit<Room, 'branchId'> & { networks?: { name: string; amount: number }[]; branchName: string })[],
    ): Promise<RoomDocument[]> => {
        const { data } = await this.api.post('/excel', rooms);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Room>): Promise<RoomDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<RoomDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<RoomDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };

    static getFreeRoomsCount = async (query: Partial<Pick<Room, 'type'> & { baseId: string }>): Promise<{ free: number; overall: number }> => {
        const { data } = await this.api.get('/free', { params: query });
        return data;
    };

    static getSoldiersInRoomByDate = async (query: { roomId: string; date: Date }): Promise<SoldierDocument[]> => {
        const { data } = await this.apiOfRoomInCourse.get('/soldiers-by-date', { params: query });
        return data;
    };

    static getRoomsWithOccupationByCourseId = async (
        courseId: string,
    ): Promise<{
        selectedRooms: RoomWithCapacity[];
        staffBedrooms: RoomWithCapacity[];
        soldiersBedrooms: RoomWithCapacity[];
        offices: RoomWithCapacity[];
        classes: RoomWithCapacity[];
    }> => {
        const { data } = await this.apiOfRoomInCourse.get(`/${courseId}/occupation`);
        return data;
    };

    static getRoomsWithOccupationByBaseId = async (
        baseId: string,
    ): Promise<{
        staffBedrooms: RoomWithCapacity[];
        soldiersBedrooms: RoomWithCapacity[];
        offices: RoomWithCapacity[];
        classes: RoomWithCapacity[];
    }> => {
        const { data } = await this.apiOfRoomInCourse.get(`/${baseId}/occupation`);
        return data;
    };

    /**
     * Get resources of a specific type and add them to the state.
     * Includes pagination.
     * @param step - The step of the pagination.
     * @param type - The type of the room to get.
     * @param isStaff - Whether the room is staff or not.
     * @param areaId - The area id to filter by.
     * @param buildingId - The building id to filter by.
     * @param gender - The gender to filter by.
     * @param networkIds - The networks ids to filter by.
     * @param branchId - The branch to filter by.
     * @param courseId - The course id to filter by.
     * @param eventId - The event id to filter by.
     * @param startDate - The start date to filter by.
     * @param useCoursesFlag - Whether to use the course filter or not.
     * @param limit - The limit of the pagination.
     * @returns The rooms with their capacity.
     */
    static getRoomWithOccupationByType = async (query: {
        step?: number;
        type?: RoomTypes;
        isStaff?: boolean;
        areaId?: string;
        buildingId?: string;
        gender?: Genders;
        networkIds?: string[];
        branchId?: string;
        courseId?: string;
        eventId?: string;
        startDate?: Date;
        useCoursesFlag?: boolean;
        limit?: number;
        roomName?: string;
        baseId?: string;
    }): Promise<RoomWithCapacity[]> => {
        const { data } = await this.api.post('/current', {
            ...query,
        });
        return data;
    };
}
