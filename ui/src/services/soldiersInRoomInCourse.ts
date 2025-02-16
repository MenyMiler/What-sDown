import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { CourseDocument, PopulatedCourse } from '../interfaces/course';
import { Soldier } from '../interfaces/soldier';
import {
    PopulatedSoldierInRoomInCourse,
    SoldierInCourse,
    SoldierInRoomInCourse,
    SoldierInRoomInCourseDocument,
} from '../interfaces/soldierInRoomInCourse';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class SoldiersInRoomInCourseService {
    private static api = createAxiosInstance(environment.api.soldierInRoomInCourses);

    static addSoldiersToRoomInCourse = async <T extends boolean>(
        roomOfCourseId: string,
        soldierId: string,
    ): Promise<ConditionalReturnType<T, PopulatedCourse, CourseDocument>> => {
        const { data } = await this.api.post('/', { roomOfCourseId, soldierId });

        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<SoldierInRoomInCourse, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedSoldierInRoomInCourse[], SoldierInRoomInCourseDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static getSoldiersInBedroom = async (roomId: string) => {
        const { data } = await this.api.get(`/soldiersInBedroom/${roomId}`);
        return data;
    };

    static deleteBulk = async (roomId: string, soldiersInRoomInCourse: string[]): Promise<SoldierInRoomInCourseDocument[]> => {
        const { data } = await this.api.patch(`${roomId}/soldiers/remove`, { soldiersInRoomInCourse });
        return data;
    };

    static createSoldiersAndAddToRoomInCourse = async (courseId: string, soldiers: Soldier[]): Promise<Boolean> => {
        const { data } = await this.api.post('/bulk', { soldiers, courseId });
        return data;
    };

    static replaceSoldiers = async (
        soldiers: SoldierInCourse[],
        fromRoomId: string,
        toRoomId: string,
        startDate: Date,
        endDate: Date,
        isStaff: boolean,
    ) => {
        const { data } = await this.api.post('/replace', { soldiers, fromRoomId, toRoomId, startDate, endDate, isStaff });
        return data;
    };

    static deleteOne = async (courseId: string, soldierId: string): Promise<CourseDocument> => {
        const { data } = await this.api.post('/delete/bulk', { roomOfCourseIds: [courseId], soldierIds: [soldierId] });
        return data;
    };
}
