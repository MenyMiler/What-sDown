import { PopulatedFloor } from './floor';

export interface Building {
    name: string;
    areaId: String;
    isStaff?: boolean;
}

export interface BuildingDocument extends Building {
    _id: string;
}

export interface PopulatedBuilding extends BuildingDocument {
    floors: PopulatedFloor[];
}

export interface PopulatedBuildingsWithResourcesSpreed extends BuildingDocument {
    roomIds: string[];
    floorIds: string[];
}
