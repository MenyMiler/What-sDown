import { config } from '../../config';
import { System, SystemDocument } from '../../interfaces/system';
import { axios } from '../../utils/axios';

const { uri, baseRoute } = config.systems;

export const exapleSystems = [
    {
        name: 'system1',
        status: true,
    },
    {
        name: 'system2',
        status: false,
    },
    {
        name: 'system3',
        status: true,
    },
    {
        name: 'system4',
        status: false,
    },
    {
        name: 'system5',
        status: true,
    },
    {
        name: 'system6',
        status: false,
    },
];

export const getSystems = async () => {
    const { data } = await axios.get<SystemDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const createSystem = async (system: System) => {
    const { data } = await axios.post<SystemDocument>(uri + baseRoute, system);
    return data;
};

export const createSystems = () => {
    return Promise.all(exapleSystems.map((system) => createSystem(system)));
};
