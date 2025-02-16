
export interface User {
    genesisId: string;
    status: Boolean;
}
export interface UserDocument extends User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}