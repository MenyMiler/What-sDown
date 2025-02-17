import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { FeaturesManager } from './manager';

import { createOneRequestSchema, deleteOneRequestSchema, getByQueryRequestSchema, updateOneRequestSchema } from './validations';

export class FeaturesController {

    static async getByAll(req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) {
        const { ...query } = req.query;

        res.json(await FeaturesManager.getByQuery(query));
    }

    static async createOne(req: TypedRequest<typeof createOneRequestSchema>, res: Response) {
        res.json(await FeaturesManager.createOne(req.body, req.user?.genesisId!));
    }

    static async updateOne(req: TypedRequest<typeof updateOneRequestSchema>, res: Response) {
        res.json(await FeaturesManager.updateOne(req.params.id, req.body, req.user?.genesisId!));
    }

    static async deleteOne(req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) {
        res.json(await FeaturesManager.deleteOne(req.params.id, req.user?.genesisId!));
    }
}
