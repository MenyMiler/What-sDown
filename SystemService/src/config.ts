import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        // uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        uri: env.get('MONGO_URI').default('mongodb://mongodb').required().asString(),

        featuresCollectionName: env.get('FEATURES_COLLECTION_NAME').default('features').required().asString(),
    },
};
