import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { Area, AreaDocument } from '../../interfaces/area';
import { BaseDocument } from '../../interfaces/base';
import { axios } from '../../utils/axios';

const { uri, areasRoute, numberOfAreasInEachBase } = config.resources;

export const getAreas = async () => {
    const { data } = await axios.get<AreaDocument[]>(uri + areasRoute, { params: config.getManyParams });
    return data;
};

const createArea = async (area: Area) => {
    const { data } = await axios.post<AreaDocument>(uri + areasRoute, area);
    return data;
};

export const createAreas = async (bases: BaseDocument[]) => {
    const areaNames: string[] = [];

    while (areaNames.length < bases.length * numberOfAreasInEachBase) {
        const areaName = faker.animal[faker.animal.type()]();
        if (areaNames.indexOf(areaName) === -1) areaNames.push(areaName);
    }

    return Promise.all(
        bases.flatMap(({ _id: baseId }) =>
            Array.from({ length: numberOfAreasInEachBase }, async () => createArea({ baseId, name: areaNames.pop()! })),
        ),
    );
};
