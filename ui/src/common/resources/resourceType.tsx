/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/require-default-props */
import { Typography } from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { environment } from '../../globals';
import { RoomTypes, RoomWithCapacity } from '../../interfaces/room';
import { RoomsService } from '../../services/rooms';
import { ResourcesTypes } from '../../utils/resourcesTypes';
import AllResourceSorts from './allResourceSorts';
import ListOfResourcesStates from './listOfResourcesStates';
import { SortObject, SortTypes } from './sorts.types';
import { StyledBox } from './styled';
import { useUserStore } from '../../stores/user';

const { limit } = environment.pagination;

interface IResourceTypeProps {
    resourceType: ResourcesTypes;
    sortTypes: SortTypes[];
    handleSelectRoom?: (setRoom: Dispatch<SetStateAction<RoomWithCapacity[]>>, room: RoomWithCapacity) => Promise<void>;
    roomToAppend?: RoomWithCapacity;
    courseId?: string;
    eventId?: string;
    startDate?: Date;
    sx?: any;
    refetch?: boolean;
}

const ResourceType = ({ resourceType, sortTypes, handleSelectRoom, roomToAppend, courseId, eventId, startDate, sx, refetch }: IResourceTypeProps) => {
    const [resources, setResources] = useState<RoomWithCapacity[]>([]);
    const [sortObject, setSortObject] = useState<Partial<SortObject>>({});
    const [step, setStep] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const currentUser = useUserStore(({ user }) => user);

    const getResource = async (reset: boolean): Promise<void> => {
        if (reset) {
            setResources([]);
            setStep(0);
        }
        const { area: areaId, building: buildingId, gender, networks: networkIds, branch: branchId } = sortObject;
        const rooms = await RoomsService.getRoomWithOccupationByType({
            step,
            type:
                resourceType === ResourcesTypes.BEDROOM_STAFF || resourceType === ResourcesTypes.BEDROOM_SOLDIERS ? RoomTypes.BEDROOM : resourceType,
            isStaff: resourceType === ResourcesTypes.BEDROOM_STAFF || resourceType === ResourcesTypes.OFFICE,
            areaId,
            buildingId,
            gender,
            networkIds,
            branchId,
            courseId,
            startDate,
            eventId,
            baseId: currentUser.baseId,
            limit,
        });
        if (rooms.length) setResources((prev: RoomWithCapacity[]) => _.uniqBy([...prev, ...rooms], '_id'));
        setHasMore(rooms.length === environment.pagination.limit);
    };

    useEffect(() => {
        // Translate from RoomTypes to ResourcesTypes
        let roomResourceType: ResourcesTypes | undefined = roomToAppend?.type;
        if (roomToAppend?.type === RoomTypes.BEDROOM)
            roomResourceType = roomToAppend?.isStaff ? ResourcesTypes.BEDROOM_STAFF : ResourcesTypes.BEDROOM_SOLDIERS;
        if (roomToAppend && roomResourceType === resourceType)
            setResources([...resources, roomToAppend].sort((firstRoom, secondRoom) => firstRoom.name.localeCompare(secondRoom.name)));
    }, [roomToAppend]);

    // First fetch of resource type
    useEffect(() => {
        getResource(true);
    }, [currentUser.baseId]);

    // Reset pagination when changing sort
    useEffect(() => {
        getResource(true);
    }, [sortObject, courseId, eventId, startDate, currentUser.baseId, refetch]);

    // Pagination
    useEffect(() => {
        if (step !== 0) getResource(false);
    }, [step, currentUser.baseId]);

    return (
        <StyledBox sx={sx}>
            <div>
                <Typography variant="h6" gutterBottom component="div">
                    {i18next.t(`resourceManagement.sortResourcesStates.${resourceType}`)}
                </Typography>
                <AllResourceSorts sortTypes={sortTypes} setSortObject={setSortObject} />
            </div>

            <ListOfResourcesStates
                resources={resources}
                handleSelectRoom={handleSelectRoom ? handleSelectRoom.bind(null, setResources) : undefined}
                nextStep={() => setStep(step + 1)}
                hasMore={hasMore}
            />
        </StyledBox>
    );
};

export default ResourceType;
