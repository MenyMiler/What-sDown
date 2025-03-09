

export interface IShragaUser {
    _id: string;
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
    status: boolean;//if admin
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

