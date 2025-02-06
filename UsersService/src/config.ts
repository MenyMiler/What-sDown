import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(7000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        UsersCollectionName: env.get('USERS_COLLECTION_NAME').default('users').required().asString(),
    },
};
