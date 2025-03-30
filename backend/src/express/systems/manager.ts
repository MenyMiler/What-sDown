import { System, typeUser } from './interface.js';
import { UsersService } from '../users/service.js';
import { SystemsService } from './service.js';

export class SystemsManager {
    static async getByQuery(query: Partial<System>): Promise<System[]> {
        return await SystemsService.getByQuery(query);
    }

    static async createOne(systems: Partial<System>, genesisId: string): Promise<SystemsService> {
        const user = await UsersService.getByGenesisId(genesisId);
        if (user.type === typeUser.admin) {
            return await SystemsService.createOne(systems);
        }
        throw new Error('to create you must be admin!!!!!!!');
    }

    static async updateOne(systemId: string, update: Partial<System>, genesisId: string): Promise<SystemsService> {
        const user = await UsersService.getByGenesisId(genesisId);
        if (user.type === typeUser.admin) {
            return await SystemsService.updateOne(systemId, update);
        }

        throw new Error('user is not admin!!!!!!!!!!!!!!');
    }

    static async deleteOne(systemId: string, genesisId: string): Promise<SystemsService> {
        const user = await UsersService.getByGenesisId(genesisId);
        if (user.type === typeUser.admin) {
            return await SystemsService.deleteOne(systemId);
        }
        throw new Error('to delete you must be admin!!!!!!!');
    }
}
