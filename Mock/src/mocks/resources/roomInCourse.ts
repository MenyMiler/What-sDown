import { config } from '../../config';
import { CourseDocument, SoldierAmounts } from '../../interfaces/course';
import { Genders } from '../../interfaces/room';
import { RoomInCourse, RoomInCourseDocument } from '../../interfaces/roomInCourse';
import { axios } from '../../utils/axios';
import { getRoomsWithCurrentCapacity } from './rooms';

const { uri, roomInCourseRoute } = config.resources;

export const getRoomsInCourses = async () => {
    const { data } = await axios.get<RoomInCourseDocument[]>(uri + roomInCourseRoute, { params: config.getManyParams });
    return data;
};

const getGenderAmount = (soldierAmounts: SoldierAmounts, gender: Genders) => {
    const { SPECIAL_FEMALE, SPECIAL_MALE, SPECIAL_OTHER_FEMALE, SPECIAL_OTHER_MALE } = soldierAmounts;
    switch (gender) {
        case Genders.FEMALE:
            return SPECIAL_FEMALE;
        case Genders.MALE:
            return SPECIAL_MALE;
        case Genders.OTHER_FEMALE:
            return SPECIAL_OTHER_FEMALE;
        case Genders.OTHER_MALE:
            return SPECIAL_OTHER_MALE;
        default:
            return 0;
    }
};

const createRoomInCourse = async (roomInCourse: RoomInCourse) => {
    const { data } = await axios.post<RoomInCourseDocument>(uri + roomInCourseRoute, roomInCourse);
    return data;
};

export const createRoomsInCourse = (courses: CourseDocument[]) =>
    Promise.all(
        courses.flatMap(({ _id: courseId, startDate, endDate, branchId, soldierAmounts }) => {
            const { SPECIAL_FEMALE, SPECIAL_MALE, SPECIAL_OTHER_FEMALE, SPECIAL_OTHER_MALE, ...genders } = soldierAmounts;

            return Object.entries(genders).map(async ([gender, amount]) => {
                const rooms = await getRoomsWithCurrentCapacity({
                    startDate,
                    endDate,
                    courseId,
                    gender: gender as Genders,
                    branchId: branchId as string,
                });

                return Promise.all(
                    rooms.map(({ _id }) =>
                        createRoomInCourse({
                            roomId: _id,
                            courseId,
                            startDate,
                            endDate,
                            occupation: amount + getGenderAmount(soldierAmounts, gender as Genders),
                        }),
                    ),
                );
            });
        }),
    ).then((nestedResults) => nestedResults.flat());
