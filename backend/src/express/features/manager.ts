import { Feature } from './interface.js';
import { UsersService } from '../users/service';
import { FeaturesService } from './service';

export class FeaturesManager {

    static async getByQuery(query: Partial<Feature>, genesisId: string): Promise<Feature[]> {
        return await FeaturesService.getByQuery(query, genesisId);
    }
    

    static async createOne(feature: Partial<Feature> ): Promise<FeaturesService> {
        return await FeaturesService.createOne(feature);
    }

    static async updateOne(featureId: string, update: Partial<Feature>, genesisId: string): Promise<FeaturesService> {
        const user = await UsersService.getByGenesisId(genesisId);
        console.log({user})
        if (user.status){

            return await FeaturesService.updateOne(featureId, update);
        }

        throw new Error('user is not admin!!!!!!!!!!!!!!');
    }
    static async deleteOne<T extends boolean>(systemId: string): Promise<FeaturesService>;
    static async deleteOne(featureId: string): Promise<FeaturesService> {
        return await FeaturesService.deleteOne(featureId);
    }
}

