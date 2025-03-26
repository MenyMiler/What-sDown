import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { EventDocument } from '../../interfaces/event';
import { SoldierDocument } from '../../interfaces/soldier';
import { SoldierInEvent, SoldierInEventDocument } from '../../interfaces/soldierInEvent';
import { axios } from '../../utils/axios';

const { uri, soldierInEventRoute } = config.soldiers;

export const getSoldierInEvent = async () => {
    const { data } = await axios.get<SoldierInEventDocument[]>(uri + soldierInEventRoute, { params: config.getManyParams });
    return data;
};

const createSoldierInEvent = async (soldierInEvent: SoldierInEvent) => {
    const { data } = await axios.post<SoldierInEventDocument>(uri + soldierInEventRoute, soldierInEvent);
    return data;
};

export const createSoldiersInEvents = (soldiers: SoldierDocument[], events: EventDocument[]) => {
    return Promise.all(
        events
            .filter(({ amount }) => amount)
            .map(({ _id: eventId }) => createSoldierInEvent({ eventId, soldierId: faker.helpers.arrayElement(soldiers)._id })),
    );
};
