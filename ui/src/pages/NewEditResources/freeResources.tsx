/* eslint-disable react/require-default-props */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { Box, Typography } from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import ExtendedCube, { ResourcesTypes } from './extendedCube';
import { RoomWithCapacity } from '../../interfaces/room';

interface FreeResourcesProps {
    refetchType?: ResourcesTypes;
    setRefetchType: (refetchType: ResourcesTypes | undefined) => void;
    courseId?: string;
    eventId?: string;
    startDate: Date;
    handleChange: (room: RoomWithCapacity, newCapacity: number) => void;
    changes: RoomWithCapacity[];
    refresh: boolean;
}

const FreeResources = ({ refetchType, courseId, eventId, startDate, handleChange, changes, refresh, setRefetchType }: FreeResourcesProps) => {
    return (
        <Box display="flex" gap={2} flexDirection="column" width="100%">
            <Box textAlign="left">
                <Typography
                    variant="body1"
                    noWrap
                    sx={{
                        fontSize: '1.5rem',
                    }}
                >
                    {i18next.t('newEditResourcesPage.freeResources')}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={4} flexDirection="row" width="100%">
                <ExtendedCube
                    resourceType={ResourcesTypes.STAFF_BEDROOM}
                    refetchType={refetchType}
                    setRefetchType={setRefetchType}
                    courseId={courseId}
                    eventId={eventId}
                    startDate={startDate}
                    handleChange={handleChange}
                    changes={changes}
                    refresh={refresh}
                />
                <ExtendedCube
                    resourceType={ResourcesTypes.SOLDIER_BEDROOM}
                    refetchType={refetchType}
                    setRefetchType={setRefetchType}
                    courseId={courseId}
                    eventId={eventId}
                    startDate={startDate}
                    handleChange={handleChange}
                    changes={changes}
                    refresh={refresh}
                />
                <ExtendedCube
                    resourceType={ResourcesTypes.CLASS}
                    refetchType={refetchType}
                    setRefetchType={setRefetchType}
                    courseId={courseId}
                    eventId={eventId}
                    startDate={startDate}
                    handleChange={handleChange}
                    changes={changes}
                    refresh={refresh}
                />
                <ExtendedCube
                    resourceType={ResourcesTypes.OFFICE}
                    refetchType={refetchType}
                    setRefetchType={setRefetchType}
                    courseId={courseId}
                    eventId={eventId}
                    startDate={startDate}
                    handleChange={handleChange}
                    changes={changes}
                    refresh={refresh}
                />
            </Box>
        </Box>
    );
};

export default FreeResources;
