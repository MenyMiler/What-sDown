
export enum typeUser {
    user = "USER",
    admin = "ADMIN",
}



export interface User {
    genesisId: string;
    type: typeUser;
}
export interface UserDocument extends User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}