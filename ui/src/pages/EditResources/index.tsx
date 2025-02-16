/* eslint-disable react/no-array-index-key */
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Legend from '../../common/Legend';
import ResourcesView from '../../common/resources/resourcesView';
import { environment } from '../../globals';
import { RoomWithCapacity } from '../../interfaces/room';
import { RoomInCourseService } from '../../services/roomInCourse';
import { RoomsService } from '../../services/rooms';
import { useUserStore } from '../../stores/user';
import SelectedResources from './selectedResources';
import { ResourcesTypes } from '../../utils/resourcesTypes';
import { convertDateTolocaleString } from '../../utils/today';
import { ActivityLogService } from '../../services/activityLogs';
import { ActionTypes, ActivityTypes } from '../../interfaces/activityLogs';
import { RoomInEventService } from '../../services/roomInEvent';

const { colors } = environment;

export interface EditResourcesLocationState {
    state: { baseId: string; courseId?: string; eventId?: string; name: string; startDate: Date; endDate: Date };
}

const EditResources = () => {
    const {
        state: { baseId, courseId, eventId, name, startDate, endDate },
    }: EditResourcesLocationState = useLocation();
    const currentUser = useUserStore(({ user }) => user);
    const [selectedRooms, setSelectedRooms] = useState<RoomWithCapacity[]>([]);
    const [unselectedRoom, setUnselectedRoom] = useState<RoomWithCapacity>();
    const [refetchType, setRefetchType] = useState<ResourcesTypes>();

    const navigate = useNavigate();

    useEffect(() => {
        if (!baseId) return;
        if (currentUser.baseId! !== baseId) {
            toast.error(i18next.t('error.courseNotInBase'));
            navigate('/');
        }
    }, [currentUser.baseId, baseId]);

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
    }, [courseId, eventId]);

    /**
     * A function to handle the selection of a room.
     * It will add the room to the state and remove it from the other state.
     * @param setAddRoom - The setter of the state to be appended.
     * @param setRemoveRoom - The setter of the state to be removed.
     * @param room - The selected room to append.
     */
    const selectRoom = (setRemoveRoom: Dispatch<SetStateAction<RoomWithCapacity[]>>, room: RoomWithCapacity) => {
        setSelectedRooms((prev: RoomWithCapacity[]) =>
            [...prev, room].sort((firstRoom, secondRoom) => firstRoom.name.localeCompare(secondRoom.name)),
        );
        setRemoveRoom((prev: RoomWithCapacity[]) => prev.filter(({ _id }) => _id !== room._id));
    };

    /**
     * A function to handle the selection of a room.
     * It will add the room to the state and to the database.
     * @param setRoom - The setter of the state to be appended.
     * @param room - The selected room.
     */
    const handleSelectRoom = async (setRoom: Dispatch<SetStateAction<RoomWithCapacity[]>>, room: RoomWithCapacity): Promise<void> => {
        const { _id: roomId, currentCapacity } = room;
        try {
            if (courseId) await RoomInCourseService.createOne({ roomId, courseId, occupation: currentCapacity });
            if (eventId) await RoomInEventService.createOne({ roomId, eventId, occupation: currentCapacity });
            selectRoom(setRoom, room);
            toast.success(i18next.t('editResources.success'), { autoClose: 500 });
        } catch (err) {
            toast.error(i18next.t('resourceManagement.errors.update'));
        }
    };

    /**
     * A function to handle the removal of a room.
     * It will remove the room from the state and from the database.
     * @param room - The room to remove.
     */
    const handleRemoveRoom = async (room: RoomWithCapacity): Promise<void> => {
        try {
            if (courseId) await RoomInCourseService.deleteOne(room._id, courseId);
            if (eventId) await RoomInEventService.deleteOne(room._id, eventId);
            await ActivityLogService.createOne({
                type: ActivityTypes.ROOM_IN_COURSE,
                action: ActionTypes.DELETE,
                name: room.name,
                userId: currentUser.genesisId,
                metaData: {
                    courseId,
                    eventId,
                    ...room,
                },
            });
            if (room.lastCapacity || room.lastCapacity === 0) setUnselectedRoom({ ...room, currentCapacity: room.lastCapacity });
            else setRefetchType(room.type);
            setSelectedRooms((prev: RoomWithCapacity[]) => prev.filter(({ _id }) => _id !== room._id));
            toast.success(i18next.t('editResources.success'), { autoClose: 500 });
        } catch (err) {
            toast.error(i18next.t('resourceManagement.errors.removeRoom'));
        }
    };

    return (
        <Grid container direction="column" spacing={2}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item sx={{ pl: '16px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>{i18next.t('editResources.freeResources')}</Typography>
                </Grid>
                <Grid container direction="row" sx={{ pl: startDate && endDate ? '12%' : '25%' }} maxWidth="50%" gap={3}>
                    <Grid item>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>{name}</Typography>
                    </Grid>
                    {startDate && endDate && (
                        <Grid container direction="row" maxWidth="40%" gap={1}>
                            <Grid item>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>
                                    {convertDateTolocaleString(new Date(startDate))}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>-</Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>{convertDateTolocaleString(new Date(endDate))}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Grid item>
                    <Legend
                        items={[
                            { dotColor: `${colors.resourceState.full}`, text: `${i18next.t('resourceManagement.resourceStateColors.full')}` },
                            { dotColor: `${colors.resourceState.occupied}`, text: `${i18next.t('resourceManagement.resourceStateColors.occupied')}` },
                            { dotColor: `${colors.resourceState.empty}`, text: `${i18next.t('resourceManagement.resourceStateColors.empty')}` },
                        ]}
                        sx={{ display: 'flex', gap: '2rem' }}
                        spacing="space-between"
                    />
                </Grid>
            </Grid>
            <Grid item height="52vh">
                <ResourcesView
                    handleSelectRoom={handleSelectRoom}
                    courseId={courseId}
                    eventId={eventId}
                    roomToAppend={unselectedRoom}
                    refetchType={refetchType}
                />
            </Grid>
            <Grid item sx={{ pl: '16px' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>{i18next.t('editResources.usedResources')}</Typography>
            </Grid>
            <Grid item>
                <SelectedResources handleRemoveRoom={handleRemoveRoom} rooms={selectedRooms} />
            </Grid>
        </Grid>
    );
};

export default EditResources;
