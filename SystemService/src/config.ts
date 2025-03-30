import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost:27017/whatsDone').asString(),
        systemsCollectionName: env.get('SYSTEMS_COLLECTION_NAME').default('systems').asString(),
    },
};
