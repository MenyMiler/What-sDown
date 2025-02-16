import { BaseDocument } from './base';
import { KartoffelUser } from './kartoffel';

export enum Types {
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
    type: Types;
}

export interface UserDocument extends User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PopulatedUser extends Omit<UserDocument, 'baseId' | 'genesisId'> {
    base: BaseDocument;
    kartoffelUser: KartoffelUser;
}

type PermissionByBase = Pick<User, 'baseId' | 'type'>;

export interface UserPermissions extends Pick<User, 'genesisId'> {
    isDeveloper?: boolean;
    types: Types[];
    bases: BaseDocument[];
    permissionByBase: PermissionByBase[];
}
