

export interface IShragaUser {
    id: string;
    adfsId: string;
    genesisId: string;
    name: { firstName: string; lastName: string; },
    email: string;
    displayName: string;
    upn: string;
    provider: string;
    personalNumber: string;
    entityType: string;
    job: string;
    phoneNumbers: any[];
    photo: string;
    identityCard: string;
  }

export interface ISystem  {
    _id: string;
    name: string;
    status: boolean;
}

export interface NewSistem  {
    name: string;
    status: boolean;
}

export interface IMyUser {
    _id: string;
    status: boolean;
    genesisId: string
}