import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Soldier, SoldierDocument } from '../interfaces/soldier';
import { SoldierInRoomInCourseDocument } from '../interfaces/soldierInRoomInCourse';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';

export class SoldiersService {
    private static api = createAxiosInstance(environment.api.soldiers);

    static createOne = async (soldier: Soldier): Promise<SoldierDocument> => {
        const { data } = await this.api.post('/', soldier);
        return data;
    };

    static createMany = async (soldiers: Soldier[]): Promise<SoldierDocument[]> => {
        const { data } = await this.api.post('/bulk', soldiers);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Soldier>): Promise<SoldierDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<SoldierDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static getCurrentAmount = async (baseId?: string): Promise<number> => {
        const { data } = await this.api.get('/count/current', { params: { baseId } });
        return data;
    };

    static searchSoldierAssociation = async (agGridRequest: agGridRequest & { soldierId: string }): Promise<agGridResponse<SoldierDocument>> => {
        const { data } = await this.api.post('/association', agGridRequest);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<SoldierDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };

    static getSoldierById = async (id: string): Promise<SoldierDocument> => {
        const { data } = await this.api.get<SoldierDocument>(`/${id}`);
        return data;
    };

    static getSoldiersByQuery = async (soldier: Omit<Soldier, 'exceptional'>): Promise<SoldierDocument[]> => {
        const { data } = await this.api.get<SoldierDocument[]>('/', { params: soldier });

        return data;
    };
}
