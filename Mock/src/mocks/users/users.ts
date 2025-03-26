import { config } from '../../config';
import {  typeUser, User, UserDocument } from '../../interfaces/user';
import { axios } from '../../utils/axios';

const { uri, baseRoute } = config.users;

const user1KartoffelId = '5e5688324203fc40043591aa';
const user2KartoffelId = '5e5688d54203fc40043591ac';
const user3KartoffelId = '5e5689514203fc40043591ae';

export const exapleUsers = [
    {
        genesisId: user1KartoffelId,
        type: typeUser.admin,
    },
    {
        genesisId: user2KartoffelId,
        type: typeUser.user,
    },
    {
        genesisId: user3KartoffelId,
        type: typeUser.user,
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

export const createUsers = () => {
    return Promise.all(exapleUsers.map((user) => createUser(user)));
};
