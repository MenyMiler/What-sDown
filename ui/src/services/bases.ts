import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { AreaDocument } from '../interfaces/area';
import { Base, BaseDocument, PopulatedBase } from '../interfaces/base';
import { BranchDocument } from '../interfaces/branch';
import { BuildingDocument } from '../interfaces/building';
import { NetworkDocument } from '../interfaces/network';
import { BedroomGantt, BedroomGanttFilters, ClassOrOfficeGantt, ClassOrOfficeGanttFilters } from '../interfaces/roomInCourse';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class BasesService {
    private static api = createAxiosInstance(environment.api.bases);

    private static apiOfRoomInCourse = createAxiosInstance(environment.api.roomInCourse);

    static getById = async (id: string): Promise<BaseDocument> => {
        const { data } = await this.api.get(`/${id}`);
        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<Base, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedBase[], BaseDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (base: Base): Promise<BaseDocument> => {
        const { data } = await this.api.post('/', base);
        return data;
    };

    static createBulk = async (bases: Base[]): Promise<BaseDocument[]> => {
        const { data } = await this.api.post('/bulk', bases);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Base>): Promise<BaseDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<BaseDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<BaseDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };

    static getNetworks = async (baseId: string): Promise<NetworkDocument[]> => {
        const { data } = await this.api.get(`/${baseId}/networks`);
        return data;
    };

    static getBranches = async (baseId: string): Promise<BranchDocument[]> => {
        const { data } = await this.api.get(`/${baseId}/branches`);
        return data;
    };

    static getBuildings = async (baseId: string): Promise<BuildingDocument[]> => {
        const { data } = await this.api.get(`/${baseId}/buildings`);
        return data;
    };

    static classOrOfficeGantt = async (
        baseId: string,
        classOrOfficeGanttFilters: Partial<ClassOrOfficeGanttFilters>,
    ): Promise<ClassOrOfficeGantt[]> => {
        const { data } = await this.apiOfRoomInCourse.get(`/${baseId}/office-or-class-gantt`, { params: classOrOfficeGanttFilters });
        return data;
    };

    static bedroomGantt = async (baseId: string, bedroomGanttFilters: Partial<BedroomGanttFilters>): Promise<BedroomGantt[]> => {
        const { data } = await this.apiOfRoomInCourse.get(`/${baseId}/bedroom-gantt`, { params: bedroomGanttFilters });
        return data;
    };

    // TODO add query type
    static getAllRooms = async (baseId: string, query?: GetByQuery<any>): Promise<any> => {
        const { data } = await this.api.get(`/${baseId}/rooms`, { params: query });
        return data;
    };

    static getSorts = async (
        baseId: string,
    ): Promise<{
        areas: AreaDocument[];
        buildings: BuildingDocument[];
        branches: BranchDocument[];
        networks: NetworkDocument[];
    }> => {
        const { data } = await this.api.get(`/${baseId}/sorts`);
        return data;
    };
}
