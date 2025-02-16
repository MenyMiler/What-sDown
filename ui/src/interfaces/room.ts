import { AreaDocument } from './area';
import { BaseDocument } from './base';
import { BuildingDocument } from './building';
import { FloorDocument } from './floor';
import { SubLocationData } from './roomInCourse';
import { SoldierDocument } from './soldier';

export enum RoomTypes {
    CLASS = 'CLASS',
    OFFICE = 'OFFICE',
    BEDROOM = 'BEDROOM',
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
    maxCapacity: number;
    disabled?: boolean;
    gender: Genders;
}

export interface RoomDocument extends Room {
    _id: string;
}

export interface PopulatedRoom extends RoomDocument {
    floor: FloorDocument;
    building: BuildingDocument;
    area: AreaDocument;
    base: BaseDocument;
}

export interface PopulatedBuildingsWithResourcesSpreed extends BuildingDocument {
    roomIds: string[];
    floorIds: string[];
}

export interface RoomWithSoldiers extends RoomDocument {
    soldiers: SoldierDocument[];
    isStaff: boolean;
    location: SubLocationData;
}

export interface RoomWithCapacity extends RoomDocument {
    areaId: string;
    buildingName: string;
    floorNumber: number;
    currentCapacity: number;
    isInCurrCourse: boolean;
    isStaff: boolean;
    lastCapacity?: number;
}
