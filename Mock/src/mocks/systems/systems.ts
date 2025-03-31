import { config } from '../../config';
import { System, SystemDocument } from '../../interfaces/system';
import { axios } from '../../utils/axios';
import { faker } from '@faker-js/faker/locale/he';

const { uri, baseRoute } = config.systems;

export const exampleSystems = Array.from({ length: 6 }, () => ({
    name: faker.company.name(),
    status: faker.datatype.boolean(), // מחולל true/false רנדומלי
}));

export const getSystems = async () => {
    const { data } = await axios.get<SystemDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const createSystem = async (system: System) => {
    const { data } = await axios.post<SystemDocument>(uri + baseRoute, system);
    return data;
};

export const createSystems = () => {
    return Promise.all(exampleSystems.map((system) => createSystem(system)));
};
