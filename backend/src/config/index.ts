import env from 'env-var';
import './dotenv';

export const config = {
    service: {
        port: env.get('PORT').default(5000).asPortNumber(),
        systemUnavailableURL: env.get('SYSTEM_UNAVAILABLE_URL').default('/unavailable').asString(),
        maxFileSize: env.get('MAX_FILE_SIZE').default(50000000).asInt(),
        requestTimeout: env.get('REQUEST_TIMEOUT').default(10000).asIntPositive(),
        standardConcurrency: env.get('STANDARD_CONCURRENCY').default(10).asInt(),
        paginationMaxPageSize: env.get('PAGINATION_MAX_PAGE_SIZE').default(10).asInt(),
        paginationMinPageSize: env.get('PAGINATION_MIN_PAGE_SIZE').default(1).asInt(),
        corsOrigin: env.get('CORS_ORIGIN').default('http://localhost:3000').asString(),
    },
    users: {
        uri: env.get('USERS_SERVICE_URI').default('http://localhost:6050').asString(),
        baseRoute: env.get('USERS_BASE_ROUTE').default('/api/users').asString(),
    },
    features:{
        uri: env.get('SYSTEMS_SERVICE_URI').default('http://localhost:8000').asString(),
        baseRoute: env.get('SYSTEMS_BASE_ROUTE').default('/api/features').asString(),
    },
    authentication: {
        baseRoute: env.get('AUTHENTICATION_BASE_ROUTE').default('/api/auth').asString(),
        callbackURL: env.get('CALLBACK_URL').required().asString(),
        shragaURL: env.get('SHRAGA_URL').required().asString(),
        isRequired: env.get('IS_AUTHENTICATION_REQUIRED').default('true').asBool(),
        mockAuthenticatedUserId: env.get('MOCK_AUTHENTICATED_USER_ID').default('5e5688324203fc40043591aa').asString(), // user1
        useEnrichId: env.get('USE_ENRICH_ID').default('true').asBool(),
        sessionSecret: env.get('SESSION_SECRET').default('secret').asString(),
        secret: env.get('SECRET_KEY').default('vision@secret_1234').asString(),
        token: env.get('ACCESS_TOKEN_NAME').required().asString(),
        expiresIn: env.get('ACCESS_TOKEN_EXPIRATION_TIME').default('1d').asString(),

    },
};
