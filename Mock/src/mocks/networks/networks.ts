import { config } from '../../config';
import { NetworkDocument } from '../../interfaces/network';
import { axios } from '../../utils/axios';

const { uri, baseRoute } = config.networks;

const networkNames = ['עד הקצה', 'נס הרים', 'צה"לנט', 'סוף'];

export const getNetworks = async () => {
    const { data } = await axios.get<NetworkDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const createNetwork = async (name: string) => {
    const { data } = await axios.post<NetworkDocument>(uri + baseRoute, { name });
    return data;
};

export const createNetworks = () => {
    return Promise.all(networkNames.map(createNetwork));
};
