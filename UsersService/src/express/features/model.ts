import mongoose from 'mongoose';
import { config } from '../../config.js';
import { FeatureDocument } from './interface.js';

const FeaturesSchema = new mongoose.Schema<FeatureDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

export const FeaturesModel = mongoose.model<FeatureDocument>(config.mongo.featuresCollectionName, FeaturesSchema);
