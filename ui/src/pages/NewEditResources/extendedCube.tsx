/* eslint-disable react/require-default-props */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import i18next from 'i18next';
import { FilterList } from '@mui/icons-material';
import _ from 'lodash';
import Cube from './cube';
import FilterCube from './filterCube';
import { RoomTypes, RoomWithCapacity } from '../../interfaces/room';
import { useUserStore } from '../../stores/user';
import { RoomsService } from '../../services/rooms';
import { SortObject, SortTypes } from '../../common/resources/sorts.types';

export enum ResourcesTypes {
    CLASS = 'class',
    OFFICE = 'office',
    SOLDIER_BEDROOM = 'soldier bedroom',
    STAFF_BEDROOM = 'staff bedroom',
}

interface ExtendedCubeProps {
    resourceType: ResourcesTypes;
    courseId?: string;
    eventId?: string;
    startDate: Date;
    refetchType?: ResourcesTypes;
    setRefetchType: (refetchType: ResourcesTypes | undefined) => void;
    handleChange: (room: RoomWithCapacity, newCapacity: number) => void;
    changes: RoomWithCapacity[];
    refresh: boolean;
}

const ExtendedCube = ({
    resourceType,
    courseId,
    eventId,
    startDate,
    refetchType,
    handleChange,
    setRefetchType,
    changes,
    refresh,
}: ExtendedCubeProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [resources, setResources] = useState<RoomWithCapacity[]>([]);
    const [sortObject, setSortObject] = useState<Partial<SortObject>>({});
    const currentUser = useUserStore(({ user }) => user);

    const getResource = async (reset: boolean, currentSortObject: Partial<SortObject> = sortObject): Promise<void> => {
        if (reset) setResources([]);
        const { area: areaId, building: buildingId, gender, networks: networkIds, branch: branchId, name: roomName } = currentSortObject;
        const rooms = await RoomsService.getRoomWithOccupationByType({
            type:
                resourceType === ResourcesTypes.STAFF_BEDROOM || resourceType === ResourcesTypes.SOLDIER_BEDROOM
                    ? RoomTypes.BEDROOM
                    : resourceType === ResourcesTypes.OFFICE
                    ? RoomTypes.OFFICE
                    : RoomTypes.CLASS,
            isStaff: resourceType === ResourcesTypes.STAFF_BEDROOM || resourceType === ResourcesTypes.OFFICE,
            areaId,
            buildingId,
            gender,
            networkIds,
            branchId,
            courseId,
            eventId,
            startDate,
            roomName,
            baseId: currentUser.baseId,
        });

        if (rooms.length) setResources((prev: RoomWithCapacity[]) => _.uniqBy([...prev, ...rooms], '_id'));
    };

    const setSort = (sortType: SortTypes, value: string | string[] | undefined) => setSortObject((object) => ({ ...object, [sortType]: value }));

    useEffect(() => {
        getResource(true);
    }, [currentUser.baseId, refresh]);

    useEffect(() => {
        if (refetchType && refetchType === resourceType) {
            getResource(true);
            setRefetchType(undefined);
        }
    }, [refetchType]);

    useEffect(() => {
        if (Object.values(sortObject).length) getResource(true);
    }, [sortObject]);

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection="column" width="20.5rem" ml="1rem" mb="0.5rem">
            <Box display="flex" alignItems="center" justifyContent="space-between" width="20.5rem">
                <Typography>{i18next.t(`newEditResourcesPage.${resourceType}`)}</Typography>

                <IconButton
                    size="small"
                    onClick={() => {
                        setOpen(!open);
                        if (open) {
                            setSortObject({});
                            getResource(true, {});
                        }
                    }}
                >
                    <FilterList color={open ? 'primary' : 'inherit'} />
                </IconButton>
            </Box>
            {open && <FilterCube resourceType={resourceType} setSort={setSort} />}
            <Cube resources={resources} openFilterCubeState={open} resourceType={resourceType} handleChange={handleChange} changes={changes} />
        </Box>
    );
};

export default ExtendedCube;
