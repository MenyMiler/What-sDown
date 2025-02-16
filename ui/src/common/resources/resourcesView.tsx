/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
import { Divider } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { RoomWithCapacity } from '../../interfaces/room';
import { ResourcesTypes } from '../../utils/resourcesTypes';
import ResourceType from './resourceType';
import { SortTypes } from './sorts.types';
import { MainCardStyled } from './styled';

interface IResourcesViewProps {
    handleSelectRoom?: (setRoom: Dispatch<SetStateAction<RoomWithCapacity[]>>, room: RoomWithCapacity) => Promise<void>;
    courseId?: string;
    eventId?: string;
    startDate?: Date;
    roomToAppend?: RoomWithCapacity;
    refetchType?: ResourcesTypes;
}

const ResourcesView = ({ handleSelectRoom, courseId, eventId, startDate, roomToAppend, refetchType }: IResourcesViewProps) => (
    <MainCardStyled>
        <ResourceType
            resourceType={ResourcesTypes.BEDROOM_STAFF}
            sortTypes={[SortTypes.BUILDING, SortTypes.AREA, SortTypes.GENDER]}
            handleSelectRoom={handleSelectRoom}
            roomToAppend={roomToAppend}
            courseId={courseId}
            eventId={eventId}
            startDate={startDate}
            refetch={refetchType === ResourcesTypes.BEDROOM_STAFF}
        />
        <Divider sx={{ border: '1px solid', borderColor: '#CFCFCF' }} orientation="vertical" flexItem />
        <ResourceType
            resourceType={ResourcesTypes.BEDROOM_SOLDIERS}
            sortTypes={[SortTypes.BUILDING, SortTypes.AREA, SortTypes.GENDER]}
            handleSelectRoom={handleSelectRoom}
            roomToAppend={roomToAppend}
            courseId={courseId}
            eventId={eventId}
            startDate={startDate}
            refetch={refetchType === ResourcesTypes.BEDROOM_SOLDIERS}
        />
        <Divider sx={{ border: '1px solid', borderColor: '#CFCFCF' }} orientation="vertical" flexItem />
        <ResourceType
            resourceType={ResourcesTypes.CLASS}
            sortTypes={[SortTypes.BRANCH, SortTypes.AREA, SortTypes.NETWORKS]}
            handleSelectRoom={handleSelectRoom}
            roomToAppend={roomToAppend}
            courseId={courseId}
            eventId={eventId}
            startDate={startDate}
            refetch={refetchType === ResourcesTypes.CLASS}
        />
        <Divider sx={{ border: '1px solid', borderColor: '#CFCFCF' }} orientation="vertical" flexItem />
        <ResourceType
            resourceType={ResourcesTypes.OFFICE}
            sortTypes={[SortTypes.BRANCH, SortTypes.AREA, SortTypes.NETWORKS]}
            handleSelectRoom={handleSelectRoom}
            roomToAppend={roomToAppend}
            courseId={courseId}
            eventId={eventId}
            startDate={startDate}
            refetch={refetchType === ResourcesTypes.OFFICE}
        />
    </MainCardStyled>
);

export default ResourcesView;
