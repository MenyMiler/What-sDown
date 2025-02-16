import { RoomDocument } from './room';

export enum FloorTypes {
    PRE_ENLISTMENT = 'PRE_ENLISTMENT',
    PRE_ENLISTMENT_CONTINUE = 'PRE_ENLISTMENT_CONTINUE',
    BASIC = 'BASIC',
    BASIC_CONTINUE = 'BASIC_CONTINUE',
    ADVANCED = 'ADVANCED',
    FURTHER_EDUCATION = 'FURTHER_EDUCATION',
    COMMAND = 'COMMAND',
}

export interface Floor {
    buildingId: String;
    floorNumber: number;
    type: FloorTypes;
}

export interface FloorDocument extends Floor {
    _id: string;
}

export interface PopulatedFloor extends FloorDocument {
    rooms: RoomDocument[];
}

export interface PopulatedFloorsWithResourcesSpreed extends FloorDocument {
    roomIds: string[];
}
