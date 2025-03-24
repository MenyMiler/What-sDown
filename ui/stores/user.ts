import { typeUser, type IShragaUser, type ISystem } from "utils/interfaces";
import { create } from "zustand";

export interface UserState {
  user: IShragaUser;
  setUser: (user: UserState["user"]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    _id: "",
    id: "",
    adfsId: "",
    genesisId: "",
    name: { firstName: "", lastName: "" },
    email: "",
    displayName: "",
    upn: "",
    provider: "",
    personalNumber: "",
    entityType: "",
    job: "",
    phoneNumbers: [],
    photo: "",
    identityCard: "",
    type: typeUser.user, //if admin
  },
  setUser: (user) => set({ user }),
}));

export interface SystemState {
  systems: ISystem[];
  setSystems: (systems: SystemState["systems"]) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  systems: [],
  setSystems: (systems) => set({ systems }),
}));

export interface AdminsState {
  admins: {
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
  }[];
  setAdmins: (admins: AdminsState["admins"]) => void;
}

export const useAdminsStore = create<AdminsState>((set) => ({
  admins: [],
  setAdmins: (admins) => set({ admins }),
}));
