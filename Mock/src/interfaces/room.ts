import { SubLocationData } from './roomInCourse';

export enum RoomTypes {
    CLASS = 'CLASS',
    OFFICE = 'OFFICE',
    BEDROOM = 'BEDROOM',
    AUDITORIUM = 'AUDITORIUM',
}

export enum Genders {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER_MALE = 'OTHER_MALE',
    OTHER_FEMALE = 'OTHER_FEMALE',
}

export interface Room {
    floorId: String;
    branchId: String;
    type: RoomTypes;
    name: string;
    maxCapacity?: number;
    disabled?: boolean;
    gender?: Genders;
}

export interface RoomDocument extends Room {
    _id: String;
}

interface DatesWithOccupation {
    start: Date;
    end: Date;
    occupation: number;
}

export interface GetRoomsWithCurrentCapacityAggregationResult extends Omit<RoomDocument, 'disabled'> {
    isStaff: boolean;
    location: SubLocationData & { areaId: string };
    dates: DatesWithOccupation[];
}

export interface GetRoomsWithCurrentCapacityFinalResult extends Omit<GetRoomsWithCurrentCapacityAggregationResult, 'dates'> {
    currentCapacity: number;
}
