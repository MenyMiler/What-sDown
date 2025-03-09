

// export interface UserState {
//     user: {
//         id: string;
//         adfsId: string;
//         genesisId: string;
//         name: {
//             firstName: string;
//             lastName: string;
//         };
//         email: string;
//         displayName: string;
//         upn: string;
//         provider: string;
//         entityType: string;
//         job: string;
//         phoneNumbers: string[];
//         clearance: string;
//         photo: string;
//         iat: number;
//         exp: number;
//         baseId: string;
//         currentUserType: UserTypes;
//     } & UserPermissions;
//     setUser: (user: UserState['user']) => void;
// }

// export const useUserStore = create<UserState>((set) => ({
//     user: {
//         id: '',
//         adfsId: '',
//         genesisId: '',
//         name: {
//             firstName: '',
//             lastName: '',
//         },
//         email: '',
//         displayName: '',
//         upn: '',
//         provider: '',
//         entityType: '',
//         job: '',
//         phoneNumbers: [],
//         clearance: '',
//         photo: '',
//         iat: 0,
//         exp: 0,
//         baseId: '',
//         currentUserType: UserTypes.BASIC_USER,
//         types: [],
//         bases: [],
//         permissionByBase: [],
//     },
//     setUser: (user) => set({ user }),
// }));
