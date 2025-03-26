export interface BranchInBase {
    baseId: String;
    branchId: String;
}

export interface BranchInBaseDocument extends BranchInBase {
    _id: string;
}
