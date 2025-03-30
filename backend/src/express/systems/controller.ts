import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { SystemsManager } from './manager';

import { createOneRequestSchema, deleteOneRequestSchema, getByQueryRequestSchema, updateOneRequestSchema } from './validations';

export class SystemsController {
    static async getByAll(req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) {
        const { ...query } = req.query;

        res.json(await SystemsManager.getByQuery(query));
    }

    static async createOne(req: TypedRequest<typeof createOneRequestSchema>, res: Response) {
        res.json(await SystemsManager.createOne(req.body, req.user?.genesisId!));
    }

    static async updateOne(req: TypedRequest<typeof updateOneRequestSchema>, res: Response) {
        res.json(await SystemsManager.updateOne(req.params.id, req.body, req.user?.genesisId!));
    }

    static async deleteOne(req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) {
        res.json(await SystemsManager.deleteOne(req.params.id, req.user?.genesisId!));
    }
}
