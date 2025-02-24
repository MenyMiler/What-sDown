import axios from 'axios';
import { config } from '../../config';
import { Feature, FeatureDocument } from './interface';

const {
    features: { uri, baseRoute },
    service,
} = config;
export class FeaturesService {
    private static api = axios.create({ baseURL: `${uri}${baseRoute}`, timeout: service.requestTimeout});

    static async getByQuery(query: Partial<Feature>) {
        const { data } = await FeaturesService.api.get<FeatureDocument[]>(`/`, { params: { query } });
        return data;
    }

    static async createOne(feature: Partial<Feature>) {
        const { data } = await FeaturesService.api.post<FeatureDocument>(`/`,feature);
        return data;
    }

    static async createMany(features: Partial<Feature>[]) {
        const { data } = await FeaturesService.api.post<FeatureDocument[]>(`/`,features);
        return data;
    }

    static async updateOne(systemId: string, update: Partial<Feature>) {
        const { data } = await FeaturesService.api.put<FeatureDocument>(`/${systemId}`, update);
        return data;
    }
    
    static async deleteOne(featureId: string) {
        const { data } = await FeaturesService.api.delete<FeatureDocument>(`/${featureId}`);
        return data;
    }

}