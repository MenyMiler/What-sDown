import { Feature, typeUser } from './interface.js';
import { UsersService } from '../users/service';
import { FeaturesService } from './service';

export class FeaturesManager {
    static async getByQuery(query: Partial<Feature>): Promise<Feature[]> {
        return await FeaturesService.getByQuery(query);
    }

    static async createOne(feature: Partial<Feature>, genesisId: string): Promise<FeaturesService> {
        const user = await UsersService.getByGenesisId(genesisId);
        if (user.type === typeUser.admin) {
            return await FeaturesService.createOne(feature);
        }
        throw new Error('to create you must be admin!!!!!!!');
    }

    static async updateOne(featureId: string, update: Partial<Feature>, genesisId: string): Promise<FeaturesService> {
        const user = await UsersService.getByGenesisId(genesisId);
        if (user.type === typeUser.admin) {
            return await FeaturesService.updateOne(featureId, update);
        }

        throw new Error('user is not admin!!!!!!!!!!!!!!');
    }

    static async deleteOne(featureId: string, genesisId: string): Promise<FeaturesService> {
        const user = await UsersService.getByGenesisId(genesisId);
        if (user.type === typeUser.admin) {
            return await FeaturesService.deleteOne(featureId);
        }
        throw new Error('to delete you must be admin!!!!!!!');
    }
}
