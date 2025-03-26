import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { NetworkDocument } from '../../interfaces/network';
import { Genders, GetRoomsWithCurrentCapacityFinalResult, Room, RoomDocument, RoomTypes } from '../../interfaces/room';
import { axios } from '../../utils/axios';
import { maybe } from '../../utils/faker';
import { getPopulatedBases } from './bases';
import { NetworkInRoom } from '../../interfaces/networkInRoom';

const { uri, roomsRoute, numberOfRooms, bedroomSizes, maxComputersInClassOrOffice } = config.resources;

export const getRooms = async () => {
    const { data } = await axios.get<RoomDocument[]>(uri + roomsRoute, { params: config.getManyParams });
    return data;
};

export const getRoom = async (roomId: string) => {
    const { data } = await axios.get<RoomDocument>(`${uri + roomsRoute}/${roomId}`);
    return data;
};

export const getRoomsWithCurrentCapacity = async (query: {
    startDate: Date;
    endDate: Date;
    courseId?: string;
    gender?: Genders;
    branchId?: string;
    eventId?: string;
    isStaff?: boolean;
}) => {
    const { data } = await axios.get<GetRoomsWithCurrentCapacityFinalResult[]>(uri + roomsRoute, { params: { ...config.getManyParams, ...query } });
    return data;
};

const createRoom = async (room: Room & { networks?: Pick<NetworkInRoom, 'networkId' | 'amount'>[] }) => {
    const { data } = await axios.post<RoomDocument>(uri + roomsRoute, room);
    return data;
};

export const createRooms = async (networks: NetworkDocument[]) => {
    const bases = await getPopulatedBases();

    const promises: Promise<RoomDocument>[] = [];

    bases.forEach(async ({ areas, branches }) => {
        areas.forEach(({ buildings }) => {
            buildings.forEach(({ floors }) => {
                floors.forEach(({ _id: floorId }) => {
                    Array.from({ length: numberOfRooms }).forEach((_, i) => {
                        const type = faker.helpers.arrayElement(Object.values(RoomTypes));

                        promises.push(
                            createRoom({
                                floorId,
                                branchId: faker.helpers.arrayElement(branches)._id,
                                type,
                                name: `${faker.name.firstName()} ${i}`,
                                maxCapacity: faker.helpers.arrayElement(bedroomSizes),
                                disabled: faker.datatype.boolean(),
                                gender: type === RoomTypes.BEDROOM ? faker.helpers.arrayElement(Object.values(Genders)) : undefined,
                                networks:
                                    type === RoomTypes.CLASS || type === RoomTypes.OFFICE
                                        ? maybe(
                                              faker.helpers.arrayElements(networks).map(({ _id: networkId }) => ({
                                                  networkId,
                                                  amount: faker.datatype.number({ min: 1, max: maxComputersInClassOrOffice }),
                                              })),
                                          )
                                        : undefined,
                            }),
                        );
                    });
                });
            });
        });
    });

    return Promise.all(promises);
};
