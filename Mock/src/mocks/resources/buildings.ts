import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { Building, BuildingDocument } from '../../interfaces/building';
import { axios } from '../../utils/axios';
import { AreaDocument } from '../../interfaces/area';

const { uri, buildingsRoute, numberOfBuildings } = config.resources;

export const getBuildings = async () => {
    const { data } = await axios.get<BuildingDocument[]>(uri + buildingsRoute, { params: config.getManyParams });
    return data;
};

export const getBuilding = async (buildingId: string) => {
    const { data } = await axios.get<BuildingDocument>(`${uri + buildingsRoute}/${buildingId}`);
    return data;
};

const createBuilding = async (building: Building) => {
    const { data } = await axios.post<BuildingDocument>(uri + buildingsRoute, building);
    return data;
};

export const createBuildings = (areas: AreaDocument[]) => {
    return Promise.all(
        areas.flatMap(({ _id: areaId }) =>
            Array.from({ length: numberOfBuildings }, async () =>
                createBuilding({ areaId, isStaff: faker.datatype.boolean(), name: faker.name.firstName() }),
            ),
        ),
    );
};
