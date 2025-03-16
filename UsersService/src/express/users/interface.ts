/* v8 ignore start */
export interface Users {
    status: boolean;
    genesisId: string;
}

export interface UsersDocument extends Users {
    _id: string;
}

export interface IEntity {
    akaUnitHierarchy: [];
    coloredClearance: string;
    commanderOf: [string];
    createdAt: string;
    directGroup: string;
    displayName: string;
    entityType: string;
    firstName: string;
    fullName: string;
    hierarchy: string;
    id: string;
    identityCard: string;
    jabberPhone: [];
    jobTitle: string;
    lastName: string;
    mail: string;
    mobilePhone: [];
    personalNumber: string;
    phone: [];
    updatedAt: string;
    _id: string;
    status?:boolean;
  }
