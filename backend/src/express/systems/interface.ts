export interface System {
    name: string;
    status: boolean;
}

export interface SystemsDocument extends System {
    _id: string;
}

export enum typeUser {
    user = 'USER',
    admin = 'ADMIN',
}
