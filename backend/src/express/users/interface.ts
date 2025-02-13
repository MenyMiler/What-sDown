



export interface User {
    status: boolean;
    genesisId: string;
}

export default interface createUserDTO {
    genesisId: string;
}

export interface UserDocument extends User {
    _id: string;
}




// type PermissionByBase = Pick<User, 'genesisId'>;


