import { BaseDocument } from './base';
import { BranchDocument } from './branch';

export interface BranchInBase {
    baseId: String;
    branchId: String;
}

export interface BranchInBaseDocument extends BranchInBase {
    _id: string;
}

export interface PopulatedBranchInBase {
    _id: string;
    base: BaseDocument;
    branch: BranchDocument;
}
