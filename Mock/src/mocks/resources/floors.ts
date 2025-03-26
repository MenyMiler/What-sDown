import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { BuildingDocument } from '../../interfaces/building';
import { Floor, FloorDocument, FloorTypes } from '../../interfaces/floor';
import { axios } from '../../utils/axios';

const { uri, floorsRoute, numberOfFloors } = config.resources;

export const getFloors = async () => {
    const { data } = await axios.get<FloorDocument[]>(uri + floorsRoute, { params: config.getManyParams });
    return data;
};

export const getFloor = async (floorId: string) => {
    const { data } = await axios.get<FloorDocument>(`${uri + floorsRoute}/${floorId}`);
    return data;
};

const createFloor = async (floor: Floor) => {
    const { data } = await axios.post<FloorDocument>(uri + floorsRoute, floor);
    return data;
};

export const createFloors = (buildings: BuildingDocument[]) => {
    return Promise.all(
        buildings.flatMap(({ _id: buildingId }) =>
            Array.from({ length: numberOfFloors }, async (_value, index) =>
                createFloor({ buildingId, type: faker.helpers.arrayElement(Object.values(FloorTypes)), floorNumber: index + 1 }),
            ),
        ),
    );
};
