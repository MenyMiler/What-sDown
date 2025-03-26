import { config } from '../../config';
import { BaseDocument } from '../../interfaces/base';
import { UserTypes, User, UserDocument } from '../../interfaces/user';
import { axios } from '../../utils/axios';

const { uri, baseRoute, genesisIdsForInternalNetwork } = config.users;

const user1KartoffelId = '5e5688324203fc40043591aa';
const user2KartoffelId = '5e5688d54203fc40043591ac';
const user3KartoffelId = '5e5689514203fc40043591ae';

const users: Omit<User, 'baseId'>[] = genesisIdsForInternalNetwork.length
    ? genesisIdsForInternalNetwork.map((genesisId) => ({ genesisId, type: UserTypes.SUPERADMIN }))
    : [
          {
              genesisId: user1KartoffelId,
              type: UserTypes.SUPERADMIN,
          },
          {
              genesisId: user2KartoffelId,
              type: UserTypes.RESOURCE_MANAGER,
          },
          {
              genesisId: user3KartoffelId,
              type: UserTypes.PLANNING,
          },
      ];

export const getUsers = async () => {
    const { data } = await axios.get<UserDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const createUser = async (user: User) => {
    const { data } = await axios.post<UserDocument>(uri + baseRoute, user);
    return data;
};

export const createUsers = (bases: BaseDocument[]) => {
    return Promise.all(users.flatMap((user) => bases.map(({ _id: baseId }) => createUser({ ...user, baseId }))));
};
