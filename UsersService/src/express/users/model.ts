import mongoose from 'mongoose';
import { config } from '../../config.js';
import { UsersDocument } from './interface.js';

const UsersSchema = new mongoose.Schema<UsersDocument>(
    {
        type: {
            type: String,
            required: true,
        },
        genesisId: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

export const UsersModel = mongoose.model<UsersDocument>(config.mongo.UsersCollectionName, UsersSchema);
