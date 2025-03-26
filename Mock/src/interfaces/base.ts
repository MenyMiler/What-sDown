import { PopulatedArea } from './area';
import { BranchDocument } from './branch';

export interface Base {
    name: string;
    buffer?: number;
    maxCapacity?: number;
}

export interface BaseDocument extends Base {
    _id: string;
}

export interface PopulatedBase extends BaseDocument {
    areas: PopulatedArea[];
    branches: BranchDocument[];
}
