import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import {
    // createOneRequestSchema,
    // deleteOneRequestSchema,
    // deleteUserByGenesisIdRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    // searchRequestSchema,
    // updateOneRequestSchema,
} from './validations';
import { UsersService } from './service';

export class UsersController {
    static async getByQuery(req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) {
        const { populate, ...query } = req.query;

        res.json(await UsersService.getByQuery(query));
    }



    static async getById(req: TypedRequest<typeof getByIdRequestSchema>, res: Response) {
        res.json(await UsersService.getById(req.params.id));
    }

    // static async search(req: TypedRequest<typeof searchRequestSchema>, res: Response) {
    //     res.json(await UsersService.search(req.body));
    // }

    // static async createOne(req: TypedRequest<typeof createOneRequestSchema>, res: Response) {
    //     res.json(await UsersService.createOne(req.body));
    // }

    // static async updateOne(req: TypedRequest<typeof updateOneRequestSchema>, res: Response) {
    //     res.json(await UsersService.updateOne(req.params.id, req.body, req.query.populate));
    // }

    // static async deleteOne(req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) {
    //     res.json(await UsersService.deleteOne(req.params));
    // }

    // static async deleteUserByGenesisIdAndBaseId(req: TypedRequest<typeof deleteUserByGenesisIdRequestSchema>, res: Response) {
    //     res.json(await UsersService.deleteUserByGenesisIdAndBaseId(req.params.id, req.params.baseId));
    // }
}
