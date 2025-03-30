import mongoose from 'mongoose';
import { config } from '../../config.js';
import { SystemsDocument } from './interface.js';

const SystemsSchema = new mongoose.Schema<SystemsDocument>({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
});

export const SystemsModel = mongoose.model<SystemsDocument>(config.mongo.systemsCollectionName, SystemsSchema);
