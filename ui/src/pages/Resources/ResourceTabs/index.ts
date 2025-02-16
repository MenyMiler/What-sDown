import { ResourceTypes } from '../../../common/Modals/newResourceModal/importResources';
import { environment } from '../../../globals';
import { Types } from '../../../interfaces/user';
import { AreasService } from '../../../services/areas';
import { BasesService } from '../../../services/bases';
import { BranchesService } from '../../../services/branches';
import { BuildingsService } from '../../../services/buildings';
import { CourseTemplatesService } from '../../../services/courseTemplates';
import { CoursesService } from '../../../services/courses';
import { EventsService } from '../../../services/events';
import { FloorsService } from '../../../services/floors';
import { NetworksService } from '../../../services/networks';
import { RoomInCourseService } from '../../../services/roomInCourse';
import { RoomsService } from '../../../services/rooms';
import { SoldiersService } from '../../../services/soldiers';
import { UsersService } from '../../../services/users';
import { agGridRequest, agGridResponse, searchFunction } from '../../../utils/agGrid';
import { ITableProps } from '../Table';
import {
    areaTemplate,
    baseTemplate,
    branchTemplate,
    buildingTemplate,
    courseTemplate,
    courseTemplateTemplate,
    eventTemplate,
    floorTemplate,
    networkTemplate,
    roomTemplate,
    soldierTemplate,
    userTemplate,
} from './templates';

const { permissions } = environment;

export type Resource = Record<string, any> & { _id: string };

export interface IResourceTab extends ITableProps {
    label: string;
    createResource: (body: any) => Promise<Resource>;
    updateResource?: (id: string, update: Partial<Omit<Resource, '_id'>>) => Promise<Resource>;
    deleteResource?: (id: string) => Promise<Resource>;
    excel?: {
        resourceType: ResourceTypes;
        createMany: (body: any[]) => Promise<Resource[]>;
        additionalFields?: string[];
    };
    fieldsToRemove?: string[];
    userPermissions: Types[];
    getOccupation?: searchFunction;
    getSoldierAssociation?: searchFunction;
}

export const resourceTabs: IResourceTab[] = [
    {
        label: 'courses',
        createResource: (body) => CoursesService.createOne(body, false),
        updateResource: CoursesService.updateOne,
        deleteResource: (id) => CoursesService.deleteOne(id, false),
        fetchResources: CoursesService.search,
        template: courseTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'courseTemplates',
        createResource: (body) => CourseTemplatesService.createOne(body, false),
        updateResource: (id, update) => CourseTemplatesService.updateOne(id, update, false),
        deleteResource: (id) => CourseTemplatesService.deleteOne(id, false),
        fetchResources: CourseTemplatesService.search,
        template: courseTemplateTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'bases',
        createResource: BasesService.createOne,
        updateResource: BasesService.updateOne,
        fetchResources: BasesService.search,
        template: baseTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'areas',
        createResource: AreasService.createOne,
        updateResource: AreasService.updateOne,
        deleteResource: AreasService.deleteOne,
        fetchResources: AreasService.search,
        template: areaTemplate,
        excel: {
            resourceType: ResourceTypes.AREA,
            createMany: AreasService.createBulk,
            additionalFields: ['baseId'],
        },
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'buildings',
        createResource: BuildingsService.createOne,
        updateResource: BuildingsService.updateOne,
        deleteResource: BuildingsService.deleteOne,
        fetchResources: BuildingsService.search,
        template: buildingTemplate,
        excel: {
            resourceType: ResourceTypes.BUILDING,
            createMany: BuildingsService.createBulk,
            additionalFields: ['areaId'],
        },
        fieldsToRemove: ['baseId'],
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'floors',
        createResource: FloorsService.createOne,
        updateResource: FloorsService.updateOne,
        deleteResource: FloorsService.deleteOne,
        fetchResources: FloorsService.search,
        template: floorTemplate,
        excel: {
            resourceType: ResourceTypes.FLOOR,
            createMany: FloorsService.createBulk,
            additionalFields: ['buildingId'],
        },
        fieldsToRemove: ['baseId', 'areaId'],
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'rooms',
        createResource: RoomsService.createOne,
        updateResource: RoomsService.updateOne,
        deleteResource: RoomsService.deleteOne,
        fetchResources: RoomsService.search,
        getOccupation: RoomInCourseService.searchRoomOccupation as searchFunction,
        template: roomTemplate,
        excel: {
            resourceType: ResourceTypes.ROOM,
            createMany: RoomsService.createFromExcel,
            additionalFields: ['floorId'],
        },
        fieldsToRemove: ['baseId', 'areaId', 'buildingId'],
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'events',
        createResource: EventsService.createOne,
        updateResource: EventsService.updateOne,
        deleteResource: EventsService.deleteOne,
        fetchResources: EventsService.search,
        template: eventTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'branches',
        createResource: BranchesService.createOne,
        updateResource: BranchesService.updateOne,
        fetchResources: BranchesService.search,
        template: branchTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'networks',
        createResource: NetworksService.createOne,
        updateResource: NetworksService.updateOne,
        fetchResources: NetworksService.search,
        template: networkTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'soldiers',
        createResource: SoldiersService.createOne,
        updateResource: SoldiersService.updateOne,
        deleteResource: SoldiersService.deleteOne,
        fetchResources: SoldiersService.search,
        getSoldierAssociation: SoldiersService.searchSoldierAssociation as searchFunction,
        template: soldierTemplate,
        userPermissions: permissions.resourceManager,
    },
    {
        label: 'users',
        createResource: (user) => UsersService.createOne(user, false),
        updateResource: (id, update) => UsersService.updateOne(id, update, false),
        deleteResource: UsersService.deleteOne,
        fetchResources: (fetchAgGridRequest) => UsersService.search(fetchAgGridRequest, true),
        template: userTemplate,
        userPermissions: [Types.SUPERADMIN],
    },
];
