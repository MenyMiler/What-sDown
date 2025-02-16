
export interface User {
    genesisId: string;
    isAdmin: Boolean;
}
export interface UserDocument extends User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}