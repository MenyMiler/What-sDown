import { faker } from '@faker-js/faker';
import { config } from '../../config';
import { Base, BaseDocument, PopulatedBase } from '../../interfaces/base';
import { BranchDocument } from '../../interfaces/branch';
import { axios } from '../../utils/axios';

const { uri, basesRoute } = config.resources;

const bases: Base[] = [
    { name: 'בה"ד 15', buffer: 200, maxCapacity: 1100 },
    { name: 'אשלים', buffer: 100, maxCapacity: 550 },
];

export const getBases = async () => {
    const { data } = await axios.get<BaseDocument[]>(uri + basesRoute, { params: config.getManyParams });
    return data;
};

export const getPopulatedBases = async () => {
    const { data } = await axios.get<PopulatedBase[]>(uri + basesRoute, { params: { populate: true } });
    return data;
};

export const getBranches = async (baseId: string) => {
    const { data } = await axios.get<BranchDocument[]>(`${uri}${basesRoute}/${baseId}/branches`);
    return data;
};

const createBase = async (base: Base & { branches?: string[] }) => {
    const { data } = await axios.post<BaseDocument>(uri + basesRoute, base);
    return data;
};

export const createBases = (branches: BranchDocument[]) => {
    return Promise.all(bases.map((base) => createBase({ ...base, branches: faker.helpers.arrayElements(branches).map(({ _id }) => _id) })));
};
