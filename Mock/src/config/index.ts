import * as env from 'env-var';
import './dotenv';

export const config = {
    mockDelay: env.get('MOCK_DELAY').default(10000).asInt(),
    isAliveRoute: env.get('IS_ALIVE_ROUTE').default('/isAlive').asString(),
    getManyParams: { step: 0, limit: 1 },
    users: {
        uri: env.get('USERS_SERVICE_URI').default('http://localhost:6050').asString(),
        baseRoute: env.get('USERS_BASE_ROUTE').default('/api/users').asString(),
    },
    systems: {
        uri: env.get('SYSTEMS_SERVICE_URI').default('http://localhost:8000').asString(),
        baseRoute: env.get('SYSTEMS_BASE_ROUTE').default('/api/features').asString(),
    },
};
