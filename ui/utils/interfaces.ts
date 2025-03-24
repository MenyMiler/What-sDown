


export enum typeUser {
    user = "USER",
    admin = "ADMIN",
}



export interface IShragaUser {
  _id: string;
  id: string;
  adfsId: string;
  genesisId: string;
  name: { firstName: string; lastName: string };
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
  type: typeUser; //if admin
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
  type?:typeUser;
}

export interface ISystem {
  _id: string;
  name: string;
  status: boolean;
}

export interface NewSistem {
  name: string;
  status: boolean;
}
