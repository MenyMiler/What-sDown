import { config } from '../../config';
import { RoomInEventDocument } from '../../interfaces/roomInEvent';
import { SoldierDocument } from '../../interfaces/soldier';
import { SoldierInRoomInEvent, SoldierInRoomInEventDocument } from '../../interfaces/soldierInRoomInEvent';
import { axios } from '../../utils/axios';
import { getRoom } from '../resources/rooms';

const { uri, soldierInRoomInEventRoute } = config.soldiers;

export const getSoldierInRoomInEvent = async () => {
    const { data } = await axios.get<SoldierInRoomInEventDocument[]>(uri + soldierInRoomInEventRoute, { params: config.getManyParams });
    return data;
};

const createSoldierInRoom = async (soldierInRoomInEvent: SoldierInRoomInEvent) => {
    const { data } = await axios.post<SoldierInRoomInEventDocument>(uri + soldierInRoomInEventRoute, soldierInRoomInEvent);
    return data;
};

export const createSoldiersInRoomsInEvent = (soldiers: SoldierDocument[], roomsInEvents: RoomInEventDocument[]) => {
    return Promise.all(
        roomsInEvents.map(async ({ _id: roomOfEventId, roomId }) => {
            const room = await getRoom(roomId as string);
            const soldierId = soldiers.find(({ gender }) => gender === room.gender)?._id;

            if (!soldierId) return Promise.resolve();

            soldiers.splice(
                soldiers.findIndex(({ _id }) => _id === soldierId),
                1,
            );

            return createSoldierInRoom({ roomOfEventId, soldierId });
        }),
    );
};
