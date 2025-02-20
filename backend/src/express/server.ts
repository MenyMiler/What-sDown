import cookieParser from 'cookie-parser';
import { once } from 'events';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import http from 'http';
import passport from 'passport';
import cors from 'cors';

import { config } from '../config';
import { errorMiddleware } from '../utils/express/error';
import { initPassport } from '../utils/express/passport';
import { loggerMiddleware } from '../utils/logger/middleware';
import { appRouter } from './router';

export class Server {
    private app: express.Application;

    private http: http.Server;

    constructor(private port: number) {
        this.app = Server.createExpressApp();
    }

    static createExpressApp() {
        const app = express();

        app.use(helmet());
        app.use(express.json({ limit: config.service.maxFileSize }));
        app.use(express.urlencoded({ extended: true, limit: config.service.maxFileSize }));
        app.use(cookieParser());

        app.use(loggerMiddleware);

        // app.use(cors({
        //     origin: 'http://localhost:80',
        //     credentials: true
        // }));

        app.use(
            cors({
                origin: 'http://localhost',
                credentials: true,
            }),
        );

        // const allowedOrigins = [
        //     'http://localhost:3000',
        //     'http://localhost', // הוסף את זה
        // ];

        // app.use(
        //     cors({
        //         origin: (origin, callback) => {
        //             // אפשר בקשות ללא Origin (כגון מ-Postman)
        //             if (!origin) return callback(null, true);
        //             if (allowedOrigins.includes(origin)) {
        //                 return callback(null, true);
        //             }
        //             return callback(new Error('Not allowed by CORS'));
        //         },
        //         credentials: true,
        //     }),
        // );

        app.use(
            session({
                secret: config.authentication.sessionSecret,
                resave: false,
                saveUninitialized: true,
            }),
        );

        app.use(passport.initialize());
        app.use(passport.session());
        initPassport();

        app.use(appRouter);

        app.use(errorMiddleware);

        return app;
    }

    async start() {
        this.http = this.app.listen(this.port, '0.0.0.0');
        await once(this.http, 'listening');
    }
}
