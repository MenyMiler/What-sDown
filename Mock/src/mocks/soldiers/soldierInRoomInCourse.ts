import { config } from '../../config';
import { RoomInCourseDocument } from '../../interfaces/roomInCourse';
import { SoldierDocument, SoldierTypes } from '../../interfaces/soldier';
import { SoldierInEventDocument } from '../../interfaces/soldierInEvent';
import { SoldierInRoomInCourse, SoldierInRoomInCourseDocument } from '../../interfaces/soldierInRoomInCourse';
import { axios } from '../../utils/axios';
import { getBuilding } from '../resources/buildings';
import { getFloor } from '../resources/floors';
import { getRoom } from '../resources/rooms';

const { uri, soldierInRoomInCourseRoute } = config.soldiers;

export const getSoldierInRoomInCourse = async () => {
    const { data } = await axios.get<SoldierInRoomInCourseDocument[]>(uri + soldierInRoomInCourseRoute, { params: config.getManyParams });
    return data;
};

const createSoldierInRoom = async (soldierInRoomInCourse: SoldierInRoomInCourse) => {
    const { data } = await axios.post<SoldierInRoomInCourseDocument>(uri + soldierInRoomInCourseRoute, soldierInRoomInCourse);
    return data;
};

export const createSoldiersInRoomsInCourses = (
    soldiers: SoldierDocument[],
    roomsInCourses: RoomInCourseDocument[],
    soldiersInEvent: SoldierInEventDocument[],
) => {
    const filteredSoldiers = soldiers.filter(({ _id }) => soldiersInEvent.some(({ soldierId }) => soldierId !== _id));

    return Promise.all(
        roomsInCourses.map(async ({ _id: roomOfCourseId, roomId }) => {
            const { floorId, gender: roomGender } = await getRoom(roomId as string);
            const { buildingId } = await getFloor(floorId as string);
            const { isStaff } = await getBuilding(buildingId as string);
            const soldierId = filteredSoldiers.find(
                ({ gender, soldierType }) =>
                    gender === roomGender && (isStaff ? soldierType === SoldierTypes.STAFF : soldierType === SoldierTypes.STUDENT),
            )?._id;

            if (!soldierId) return Promise.resolve();

            filteredSoldiers.splice(
                filteredSoldiers.findIndex(({ _id }) => _id === soldierId),
                1,
            );

            return createSoldierInRoom({ soldierId, roomOfCourseId });
        }),
    );
};
