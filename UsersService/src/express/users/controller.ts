import { Response } from 'express';
import { TypedRequest } from '../../utils/zod.js';
import { UsersManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByGenesisGenesisIdRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
    updateOneRequestSchemaByGenesisId,
} from './validations.js';
import axios from "axios";


export class UsersController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;

        res.json(await UsersManager.getByQuery(query, step, limit));
    };

    static getCount = async (req: TypedRequest<typeof getCountRequestSchema>, res: Response) => {
        res.json(await UsersManager.getCount(req.query));
    };

    static getById = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await UsersManager.getById(req.params.id));
    };

    static getByGenesisId = async (req: TypedRequest<typeof getByGenesisGenesisIdRequestSchema>, res: Response) => {
        res.json(await UsersManager.getByGenesisId(req.params.genesisId));
    };

    static getAllAdmins = async (_req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const allMyAdmins = await UsersManager.getAllAdmins();
        let allAdmins: any[] = [];
        for (const admin of allMyAdmins) {
            const user = await axios.get(`https://kartoffel.branch-yesodot.org/api/entities/${admin.genesisId}`);
            allAdmins.push({ ...user.data, status: true });
        }
        res.json(allAdmins);
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UsersManager.createOne(req.body));
    };

    static updateOne = async (req: TypedRequest<typeof updateOneRequestSchema>, res: Response) => {
        res.json(await UsersManager.updateOne(req.params.id, req.body));
    };

    static updateOneByGenesisId = async (req: TypedRequest<typeof updateOneRequestSchemaByGenesisId>, res: Response) => {
        res.json(await UsersManager.updateOneByGenesisId(req.params.genesisId, req.body));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await UsersManager.deleteOne(req.params.id));
    };
}
