import { RoomTypes } from '../interfaces/room';

export interface ICurrState {
    roomName: string;
    currentCapacity: number;
}

export enum BedroomTypes {
    BEDROOM_SOLDIERS = 'bedroom_soldiers',
    BEDROOM_STAFF = 'bedroom_staff',
}

export enum TranslatedResourcesTypes {
    BEDROOM = 'bedroom',
    FACILITY = 'facility',
}

export const ResourcesTypes = { ...RoomTypes, ...BedroomTypes };
// eslint-disable-next-line no-redeclare
export type ResourcesTypes = RoomTypes | BedroomTypes;

export class UnknownTypeError extends Error {
    constructor(type: string) {
        super(`Unknown type: ${type}`);
    }
}

const isTypeInResourceTypes = (resourceType: Partial<typeof ResourcesTypes>, type: ResourcesTypes) => Object.values(resourceType).includes(type);

export const translateResourceType = (type: ResourcesTypes): TranslatedResourcesTypes => {
    if (isTypeInResourceTypes(BedroomTypes, type)) return TranslatedResourcesTypes.BEDROOM;
    if (isTypeInResourceTypes(RoomTypes, type)) return TranslatedResourcesTypes.FACILITY;
    throw new UnknownTypeError(type);
};

export const isStaff = (type: ResourcesTypes): boolean => type === ResourcesTypes.BEDROOM_STAFF;
