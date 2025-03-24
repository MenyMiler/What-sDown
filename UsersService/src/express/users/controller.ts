import { Response } from 'express';
import { TypedRequest } from '../../utils/zod.js';
import { UsersManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getNotAdminsRequestSchema,
    getByGenesisGenesisIdRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    updateOneRequestSchema,
    updateOneRequestSchemaByGenesisId,
} from './validations.js';
import axios from 'axios';
import { IEntity, typeUser, Users, UsersDocument } from './interface.js';

export class UsersController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;

        res.json(await UsersManager.getByQuery(query as Partial<Users>, step, limit));
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
            allAdmins.push({ ...user.data, type: typeUser.admin });
        }
        res.json(allAdmins);
    };

    //to get the all users from kartoffel & to returen the all users the not admins or not exist in my users data
    static getAllNotAdmins = async (req: TypedRequest<typeof getNotAdminsRequestSchema>, res: Response) => {
        const allMyAdmins = await UsersManager.getAllAdmins();
        const allEntities = await UsersManager.fetchEntities(req.query.page, req.query.pageSize);
        const allNotAdmins = allEntities.filter((entity: IEntity) => !allMyAdmins.find((admin: UsersDocument) => admin.genesisId === entity._id));
        res.json(allNotAdmins);
    };

    static addAdmin = async (req: TypedRequest<typeof getByGenesisGenesisIdRequestSchema>, res: Response) => {
        res.json(await UsersManager.addAdmin(req.params.genesisId));
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UsersManager.createOne({ ...req.body, type: req.body.type as typeUser}));
    };

    static updateOne = async (req: TypedRequest<typeof updateOneRequestSchema>, res: Response) => {
        res.json(await UsersManager.updateOne(req.params.id, { ...req.body, type: req.body.type as typeUser}));
    };

    static updateOneByGenesisId = async (req: TypedRequest<typeof updateOneRequestSchemaByGenesisId>, res: Response) => {
        res.json(await UsersManager.updateOneByGenesisId(req.params.genesisId, { ...req.body, type: req.body.type as typeUser}));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await UsersManager.deleteOne(req.params.id));
    };
}
