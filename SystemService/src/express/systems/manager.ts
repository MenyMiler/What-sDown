import { DocumentNotFoundError } from '../../utils/errors.js';
import { Systems, SystemsDocument } from './interface.js';
import { SystemsModel } from './model.js';

export class SystemsManager {
    static getByQuery = async (query: Partial<Systems>, step: number, limit?: number): Promise<SystemsDocument[]> => {
        return SystemsModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<Systems>): Promise<number> => {
        return SystemsModel.countDocuments(query).lean().exec();
    };

    static getById = async (systemId: string): Promise<SystemsDocument> => {
        return SystemsModel.findById(systemId).orFail(new DocumentNotFoundError(systemId)).lean().exec();
    };

    static createOne = async (system: Systems): Promise<SystemsDocument> => {
        return SystemsModel.create(system);
    };

    static createMany = async (systems: Systems[]): Promise<SystemsDocument[]> => {
        return SystemsModel.insertMany(systems);
    };

    static updateOne = async (systemId: string, update: Partial<Systems>): Promise<SystemsDocument> => {
        return SystemsModel.findByIdAndUpdate(systemId, update, { new: true }).orFail(new DocumentNotFoundError(systemId)).lean().exec();
    };

    static deleteOne = async (systemId: string): Promise<SystemsDocument> => {
        return SystemsModel.findByIdAndDelete(systemId).orFail(new DocumentNotFoundError(systemId)).lean().exec();
    };
}
