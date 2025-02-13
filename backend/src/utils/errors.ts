/* eslint-disable max-classes-per-file */

export class ServiceError extends Error {
    constructor(public code: number, message: string, public metadata: any = {}) {
        super(message);
        this.code = code;
        this.metadata = metadata;
    }
}

