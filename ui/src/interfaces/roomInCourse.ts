import { ViewMode } from '../common/ganttTask';
import { AreaDocument } from './area';
import { BaseDocument } from './base';
import { BuildingDocument } from './building';
import { FloorDocument } from './floor';
import { RoomDocument } from './room';
import { Genders, SoldierDocument } from './soldier';

export interface ClassOrOfficeGanttFilters {
    buildingId: string;
    branchId: string;
    networkIds: string[];
    startDate: Date;
    endDate: Date;
    name: string;
    type: 'CLASS' | 'OFFICE';
    viewMode?: ViewMode;
}

export interface SubDatesClassOrOfficeGanttData {
    startDate: Date;
    endDate: Date;
    occupation: number;
    courseOrEventName: string;
}

export interface ClassOrOfficeGantt {
    _id: string;
    name: string;
    branch: string;
    maxCapacity: number;
    networks: string[];
    dates: SubDatesClassOrOfficeGanttData[];
    startDate?: Date;
    endDate?: Date;
    customStart?: Date;
    customEnd?: Date;
}

export interface BedroomGanttFilters {
    buildingId: string;
    floorId: string;
    gender: Genders;
    startDate: Date;
    endDate: Date;
    name: string;
    isStaff: boolean;
    occupation: number;
    soldierId: string;
}

export interface SubLocationData {
    buildingName: string;
    floorNumber: number;
}

export interface SubDatesBedroomGanttData {
    startDate: Date;
    endDate: Date;
    soldiers: SoldierDocument[];
    occupation: number;
    soldiersOccupation: number;
}

export interface BedroomGantt {
    _id: string;
    name: string;
    maxCapacity: number;
    gender: Genders;
    location: SubLocationData;
    dates: SubDatesBedroomGanttData[];
}

export interface RoomInCourse {
    roomId: String;
    courseId: String;
    startDate: Date;
    endDate: Date;
    occupation?: number;
}

export interface RoomInCourseDocument extends RoomInCourse {
    _id: string;
}

export interface PopulatedRoomInCourse {
    _id: string;
    room: RoomDocument;
    floor: FloorDocument;
    building: BuildingDocument;
    area: AreaDocument;
    base: BaseDocument;
    courseId: string;
    startDate: Date;
    endDate: Date;
    occupation: number;
    soldiers: SoldierDocument[];
}

export enum RoomOccupationType {
    COURSE = 'course',
    EVENT = 'event',
}

export interface RoomOccupation {
    name: string;
    startDate: Date;
    endDate: Date;
    type: RoomOccupationType;
}
