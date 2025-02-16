/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import i18next from 'i18next';
import { useLocation } from 'react-router';
import { EventAvailable } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ResourcesTypes } from './extendedCube';
import FreeResources from './freeResources';
import SelectedResources from './selectedResources';
import { EditResourcesLocationState } from '../EditResources';
import { convertDateTolocaleString } from '../../utils/today';
import { RoomsService } from '../../services/rooms';
import { RoomWithCapacity } from '../../interfaces/room';
import { RoomInCourseService } from '../../services/roomInCourse';
import { RoomInEventService } from '../../services/roomInEvent';

const NewEditResources = () => {
    const {
        state: { baseId, courseId, eventId, name, startDate, endDate },
    }: EditResourcesLocationState = useLocation();
    const [selectedRooms, setSelectedRooms] = useState<RoomWithCapacity[]>([]);
    const [refetchType, setRefetchType] = useState<ResourcesTypes | undefined>(undefined);
    const [changes, setChanges] = useState<RoomWithCapacity[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        const getRooms = async () => {
            const rooms = await RoomsService.getRoomWithOccupationByType({
                courseId,
                eventId,
                useCoursesFlag: true,
                limit: 1000,
            });

            setSelectedRooms(rooms);
        };

        getRooms();
    }, [courseId, refresh, eventId]);

    const handleChange = (room: RoomWithCapacity, newCapacity: number) => {
        const isAlreadyChanged = changes.findIndex(({ _id }) => _id === room._id);
        if (newCapacity)
            if (isAlreadyChanged >= 0) {
                changes[isAlreadyChanged].currentCapacity = newCapacity;
            } else {
                const updatedRoom = { ...room, currentCapacity: newCapacity };
                setChanges((curr) => [...curr, updatedRoom]);
            }
        else {
            setChanges((curr) => curr.filter((resource) => resource._id !== room._id));
        }
    };

    const handleSave = async () => {
        try {
            if (courseId)
                await Promise.all(
                    changes.map(async (room) => {
                        await RoomInCourseService.createOne({ roomId: room._id, courseId, occupation: room.currentCapacity });
                    }),
                );
            if (eventId)
                await Promise.all(
                    changes.map(async (room) => {
                        await RoomInEventService.createOne({ roomId: room._id, eventId, occupation: room.currentCapacity });
                    }),
                );
            toast.success(i18next.t('newEditResourcesPage.savedSuccessfully'));
            setChanges([]);
            setRefresh((curr) => !curr);
        } catch (err) {
            toast.error(i18next.t('newEditResourcesPage.errors.default'));
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={4}>
            <Box display="flex" mt="1rem" justifyContent="space-between">
                <Box>
                    <Typography variant="h5">{i18next.t('editResources.title')}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                        {name}
                    </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center" sx={{ mr: '3.5rem' }}>
                    <Chip
                        label={`${convertDateTolocaleString(new Date(endDate))} - ${convertDateTolocaleString(new Date(startDate))}`}
                        variant="outlined"
                        sx={{
                            px: '1rem',
                            height: '3rem',
                            fontSize: '1rem',
                            color: '#000',
                            borderColor: '#d3d3d3',
                        }}
                        icon={<EventAvailable sx={{ color: '#000' }} />}
                    />
                    <Button
                        size="large"
                        sx={{
                            bgcolor: 'black',
                            color: 'white',
                            borderRadius: '2rem',
                            px: '2rem',
                            fontSize: '1rem',
                            '&:hover': {
                                bgcolor: 'darkgray',
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'darkgray',
                                opacity: 0.8,
                            },
                        }}
                        onClick={() => handleSave()}
                        disabled={!changes.length}
                    >
                        {i18next.t('newEditResourcesPage.saveBtn')}
                    </Button>
                </Box>
            </Box>

            <Box>
                <FreeResources
                    courseId={courseId}
                    eventId={eventId}
                    startDate={startDate}
                    refetchType={refetchType}
                    setRefetchType={setRefetchType}
                    changes={changes}
                    handleChange={handleChange}
                    refresh={refresh}
                />
                <SelectedResources
                    resources={selectedRooms}
                    setSelectedRooms={setSelectedRooms}
                    setRefetchType={setRefetchType}
                    courseId={courseId}
                    eventId={eventId}
                />
            </Box>
        </Box>
    );
};

export default NewEditResources;
