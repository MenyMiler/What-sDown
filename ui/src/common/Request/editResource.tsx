/* eslint-disable react/require-default-props */
import { Box, Grid } from '@mui/material';
import { Promise } from 'bluebird';
import i18next from 'i18next';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
import { environment } from '../../globals';
import { PopulatedRequest } from '../../interfaces/request';
import { RoomWithCapacity } from '../../interfaces/room';
import { RequestsService } from '../../services/requests';
import { RoomInCourseService } from '../../services/roomInCourse';
import { RoomInEventService } from '../../services/roomInEvent';
import { ResourcesTypes } from '../../utils/resourcesTypes';
import { AcceptButton, CancelButton } from '../Requests/Requests.styled';
import ResourceType from '../resources/resourceType';
import { SortTypes } from '../resources/sorts.types';
import SelectedResources from '../../pages/EditResources/selectedResources';

const { concurrency } = environment;

interface IEditEventOrCourseResource {
    request: PopulatedRequest;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    setOpenConfirmation: Dispatch<SetStateAction<boolean>>;
    setEditResource: Dispatch<SetStateAction<boolean>>;
    handleClose: () => void;
    resourceType: ResourcesTypes;
    courseId?: string;
    eventId?: string;
}

export const EditEventOrCourseResource = ({
    setOpenConfirmation,
    setEditResource,
    request,
    setOpenDialog,
    handleClose,
    resourceType,
    courseId,
    eventId,
}: IEditEventOrCourseResource) => {
    const [roomsToAppend, setRoomsToAppend] = useState<RoomWithCapacity[]>([]);
    const [unselectedRoom, setUnselectedRoom] = useState<RoomWithCapacity>();

    const handleAppendRooms = async () => {
        if (!roomsToAppend.length) {
            toast.error(i18next.t('resourceManagement.errors.selectRoomAndAmount'));
            return;
        }
        setRoomsToAppend(roomsToAppend);

        try {
            await Promise.map(
                roomsToAppend,
                async ({ _id: roomId, currentCapacity: occupation }) =>
                    eventId
                        ? RoomInEventService.createOne({ eventId, roomId, occupation })
                        : RoomInCourseService.createOne({ courseId, roomId, occupation }),
                {
                    concurrency,
                },
            );
            await RequestsService.updateOne(request._id);
            toast.success(i18next.t('editResources.success'), { autoClose: 500 });
        } catch (_err) {
            toast.error(i18next.t('resourceManagement.errors.update'));
        } finally {
            setOpenConfirmation(false);
            setOpenDialog(false);
            setEditResource(false);
            handleClose();
        }
    };

    /**
     * A function to handle the selection of a room.
     * It will add the room to the state and remove it from the other state.
     * @param setAddRoom - The setter of the state to be appended.
     * @param setRemoveRoom - The setter of the state to be removed.
     * @param room - The selected room to append.
     */
    const selectRoom = (setRemoveRoom: Dispatch<SetStateAction<RoomWithCapacity[]>>, room: RoomWithCapacity) => {
        setRoomsToAppend((prev: RoomWithCapacity[]) => [...prev, room]);
        setRemoveRoom((prev: RoomWithCapacity[]) => prev.filter(({ _id }) => _id !== room._id));
    };

    /**
     * A function to handle the selection of a room.
     * It will add the room to the state and to the database.
     * @param setRoom - The setter of the state to be appended.
     * @param room - The selected room.
     */
    const handleSelectRoom = async (setRoom: Dispatch<SetStateAction<RoomWithCapacity[]>>, room: RoomWithCapacity): Promise<void> => {
        selectRoom(setRoom, room);
        toast.success(i18next.t('editResources.addedResource', { name: room.name }));
    };

    const handleRemoveRoom = async (room: RoomWithCapacity): Promise<void> => {
        setRoomsToAppend((prev: RoomWithCapacity[]) => prev.filter(({ _id }) => _id !== room._id));
        setUnselectedRoom({ ...room, currentCapacity: 0 });
        toast.success(i18next.t('editResources.removedResource', { name: room.name }));
    };

    return (
        <>
            <Box display="flex" justifyContent="center" gap="1rem" alignItems="center" width="100%">
                <ResourceType
                    resourceType={resourceType}
                    sortTypes={
                        ResourcesTypes.BEDROOM_STAFF === resourceType || ResourcesTypes.BEDROOM_SOLDIERS === resourceType
                            ? [SortTypes.BUILDING, SortTypes.AREA, SortTypes.GENDER]
                            : [SortTypes.BRANCH, SortTypes.AREA, SortTypes.NETWORKS]
                    }
                    handleSelectRoom={handleSelectRoom}
                    courseId={courseId}
                    eventId={eventId}
                    sx={{ width: '100%', height: '50vh' }}
                    roomToAppend={unselectedRoom}
                />
                <SelectedResources rooms={roomsToAppend} handleRemoveRoom={handleRemoveRoom} />
            </Box>
            <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '50px' }}>
                <AcceptButton
                    sx={{ width: '20%', backgroundColor: '#E077AB', color: 'white', border: 'none' }}
                    onClick={handleAppendRooms}
                    disabled={!roomsToAppend.length}
                >
                    {i18next.t('requests.accept')}
                </AcceptButton>
                <CancelButton sx={{ width: '20%', backgroundColor: '#C0C0C0', color: 'white', border: 'none' }} onClick={() => setOpenDialog(false)}>
                    {i18next.t('resourceManagement.errors.cancel')}
                </CancelButton>
            </Grid>
        </>
    );
};
