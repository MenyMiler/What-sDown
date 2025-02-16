import { DocumentNotFoundError } from '../../utils/errors.js';
import { Users, UsersDocument } from './interface.js';
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

    static createOne = async (user: Users): Promise<UsersDocument> => {
        return UsersModel.create(user);
    };

    static updateOne = async (userId: string, update: Partial<Users>): Promise<UsersDocument> => {
        return UsersModel.findByIdAndUpdate(userId, update, { new: true }).orFail(new DocumentNotFoundError(userId)).lean().exec();
    };

    static deleteOne = async (userId: string): Promise<UsersDocument> => {
        return UsersModel.findByIdAndDelete(userId).orFail(new DocumentNotFoundError(userId)).lean().exec();
    };
}
