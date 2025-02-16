/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
import i18next from 'i18next';
import { RoomTypes } from '../../interfaces/room';
import { Types } from '../../interfaces/user';
import { BasesService } from '../../services/bases';
import { BranchesService } from '../../services/branches';
import { CoursesService } from '../../services/courses';
import { EventsService } from '../../services/events';
import { FloorsService } from '../../services/floors';
import { KartoffelService } from '../../services/kartoffel';
import { RoomsService } from '../../services/rooms';
import { SoldiersService } from '../../services/soldiers';
import { NetworksService } from '../../services/networks';
import { RoomInCourseService } from '../../services/roomInCourse';

export const formatDate = (value: any) => {
    if (!value || Number.isNaN(Date.parse(value))) return value;
    const date = new Date(value);
    return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })}`;
};

export const isValidMongoObjectId = (value: string) => /^[a-fA-F0-9]{24}$/.test(value);

export const getValueOfId = async (value: string, key: string) => {
    if (key.includes('network')) {
        // eslint-disable-next-line no-return-await
        return (await NetworksService.getById(value as string)).name;
    }

    switch (key) {
        case 'roomOfCourseId':
            const { roomId } = await RoomInCourseService.getRoomInCourseById(value);
            return (await RoomsService.getById(roomId.toString())).name;
        case 'courseId':
            return (await CoursesService.getById(value, false)).name;
        case 'courseName':
            return (await CoursesService.getById(value, false)).name;
        case 'eventId':
            return (await EventsService.getById(value, false)).name;
        case 'roomId':
            return (await RoomsService.getById(value)).name;
        case 'genesisId':
            return (await KartoffelService.getUserById(value)).fullName;
        case 'baseId':
            return (await BasesService.getById(value)).name;
        case 'branchId':
            return (await BranchesService.getById(value)).name;
        case 'floorId':
            return (await FloorsService.getById(value)).floorNumber;
        case 'soldierId':
            return (await SoldiersService.getSoldierById(value)).name;
        default:
            return value;
    }
};

export const getI18Values = (value: string, key: string, data: any) => {
    switch (key) {
        case 'userType':
            return i18next.t(`userTypes.${value}`);
        case 'type':
            if (Object.values(Types).find((element) => element === data.data.type)) {
                return i18next.t(`userTypes.${value}`);
            }
            if (Object.values(RoomTypes).find((element) => element === value)) {
                return i18next.t(`common.roomTypes.${value}`);
            }
            return i18next.t(`common.types.${value}`);
        case 'gender':
            return i18next.t(`common.genders.${value}`);
        case 'soldierType':
            return i18next.t(`common.soldierTypes.${value}`);
        case 'studentType':
            return i18next.t(`common.studentTypes.${value}`);
        default:
            return value;
    }
};

export const transformKeys = (obj: unknown): unknown => {
    // If the object is not of type object or is null, return it as is
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // If it's an array, recursively transform each element
    if (Array.isArray(obj)) {
        return obj.map((item) => transformKeys(item)); // Recursive call on array items
    }

    const result: Record<string, unknown> = {};

    // Ensure we are dealing with a valid object, not null or array
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key.includes('[') && key.includes(']')) {
                    // If the key has array-like notation (e.g., "item[0]")
                    const newKey = key.replace(/\[\d+\]/g, ''); // Remove the index part
                    const transformedValue = transformKeys((obj as Record<string, unknown>)[key]);

                    // Handle the case where the key already exists in the result object
                    if (result[newKey]) {
                        result[newKey] = Array.isArray(result[newKey])
                            ? [...(result[newKey] as unknown[]), transformedValue]
                            : [result[newKey], transformedValue];
                    } else {
                        result[newKey] = transformedValue;
                    }
                } else {
                    // If the key doesn't have array notation, transform its value recursively
                    result[key] = transformKeys((obj as Record<string, unknown>)[key]);
                }
            }
        }
    }

    return result;
};
