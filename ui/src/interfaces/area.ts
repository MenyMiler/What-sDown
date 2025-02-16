import { PopulatedBuilding } from './building';

export interface Area {
    name: string;
    baseId: String;
}

export interface AreaDocument extends Area {
    _id: string;
}

export interface PopulatedArea extends AreaDocument {
    buildings: PopulatedBuilding[];
}

export interface PopulatedAreasWithResourcesSpreed extends AreaDocument {
    roomIds: string[];
    floorIds: string[];
    buildingIds: string[];
}
