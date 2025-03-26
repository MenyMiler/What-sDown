export enum UserTypes {
    SUPERADMIN = 'SUPERADMIN',
    RESOURCE_MANAGER = 'RESOURCE_MANAGER',
    PLANNING = 'PLANNING',
    BASIC_USER = 'BASIC_USER',
    AUTHORIZED = 'AUTHORIZED',
    SERGEANT = 'SERGEANT',
    VISITOR = 'VISITOR',
}

export interface User {
    baseId: String;
    genesisId: String;
    type: UserTypes;
}

export interface UserDocument extends User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
