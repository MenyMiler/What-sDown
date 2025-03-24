import { DocumentNotFoundError } from '../../utils/errors.js';
import { IEntity, typeUser, Users, UsersDocument } from './interface.js';
import { UsersModel } from './model.js';

export class UsersManager {
    static getByQuery = async (query: Partial<Users>, step: number, limit?: number): Promise<UsersDocument[]> => {
        return UsersModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<Users>): Promise<number> => {
        return UsersModel.countDocuments(query).lean().exec();
    };

    static getById = async (userId: string): Promise<UsersDocument> => {
        return UsersModel.findById(userId).orFail(new DocumentNotFoundError(userId)).lean().exec();
    };

    static getByGenesisId = async (genesisId: string): Promise<UsersDocument> => {
        return UsersModel.findOne({ genesisId }).orFail(new DocumentNotFoundError(genesisId)).lean().exec();
    };

    static getAllAdmins = async (): Promise<UsersDocument[]> => {
        return UsersModel.find({ type: 'ADMIN' }).lean().exec();
    };

    static createOne = async (user: Users): Promise<UsersDocument> => {
        return UsersModel.create(user);
    };

    static updateOne = async (userId: string, update: Partial<Users>): Promise<UsersDocument> => {
        return UsersModel.findByIdAndUpdate(userId, update, { new: true }).orFail(new DocumentNotFoundError(userId)).lean().exec();
    };

    static updateOneByGenesisId = async (genesisId: string, update: Partial<Users>): Promise<UsersDocument> => {
        return UsersModel.findOneAndUpdate({ genesisId }, update, { new: true }).orFail(new DocumentNotFoundError(genesisId)).lean().exec();
    };

    static deleteOne = async (userId: string): Promise<UsersDocument> => {
        return UsersModel.findByIdAndDelete(userId).orFail(new DocumentNotFoundError(userId)).lean().exec();
    };

    static fetchEntities = async (page: number = 1, pageSize: number = 10): Promise<IEntity[]> => {
        try {
            const response = await fetch(`https://kartoffel.branch-yesodot.org/api/entities?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Response data is not an array');
            }
            return data;
        } catch (error) {
            console.error('Failed to fetch entities:', error);
            return [];
        }
    };

    static addAdmin = async (genesisId: string): Promise<UsersDocument> => {
        const user = await UsersModel.findOne({ genesisId });

        if(!user) {
            return UsersManager.createOne({ type: typeUser.admin, genesisId });
        }else if(user.type == typeUser.user) {
            return UsersManager.updateOneByGenesisId(genesisId, { type: typeUser.admin });
        }
        return user;
    };
}
