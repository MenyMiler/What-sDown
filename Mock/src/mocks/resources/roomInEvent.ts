import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { EventDocument } from '../../interfaces/event';
import { RoomInEvent, RoomInEventDocument } from '../../interfaces/roomInEvent';
import { axios } from '../../utils/axios';
import { getRoomsWithCurrentCapacity } from './rooms';

const { uri, roomInEventsRoute } = config.resources;

export const getRoomsInEvents = async () => {
    const { data } = await axios.get<RoomInEventDocument[]>(uri + roomInEventsRoute);
    return data;
};

const createRoomInEvent = async (roomInEvent: RoomInEvent) => {
    const { data } = await axios.post<RoomInEventDocument>(uri + roomInEventsRoute, roomInEvent);
    return data;
};

export const createRoomsInEvents = (events: EventDocument[]) => {
    return Promise.all(
        events.flatMap(async ({ _id: eventId, startDate, endDate, amount }) => {
            const rooms = await getRoomsWithCurrentCapacity({
                startDate,
                endDate,
                eventId,
                isStaff: false,
            });

            return createRoomInEvent({
                roomId: faker.helpers.arrayElement(rooms)._id,
                eventId,
                startDate,
                endDate,
                occupation: amount,
            });
        }),
    );
};
