import { Genders } from '../../interfaces/soldier';

export enum SortTypes {
    BUILDING = 'building',
    AREA = 'area',
    NETWORKS = 'networks',
    BRANCH = 'branch',
    GENDER = 'gender',
    NAME = 'name',
}

export type SortObject = {
    [SortTypes.NAME]: string;
    [SortTypes.AREA]: string;
    [SortTypes.BUILDING]: string;
    [SortTypes.BRANCH]: string;
    [SortTypes.GENDER]: Genders;
    [SortTypes.NETWORKS]: string[];
};
