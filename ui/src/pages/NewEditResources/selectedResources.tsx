/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import {
    Box,
    IconButton,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ResourcesTypes } from './extendedCube';
import State from './state';
import { StateTypes } from './chunk';
import { RoomTypes, RoomWithCapacity } from '../../interfaces/room';
import { RoomInCourseService } from '../../services/roomInCourse';
import { ActivityLogService } from '../../services/activityLogs';
import { ActionTypes, ActivityTypes } from '../../interfaces/activityLogs';
import { useUserStore } from '../../stores/user';
import DeleteDialog from './deleteDialog';
import EditDialog from './editDialog';
import { RoomInEventService } from '../../services/roomInEvent';

interface SelectedResourcesProps {
    resources: RoomWithCapacity[];
    courseId?: string;
    eventId?: string;
    setSelectedRooms: (selectedRooms: RoomWithCapacity[]) => void;
    setRefetchType: (refetchType: ResourcesTypes | undefined) => void;
}

const StyledHeader = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        color: '#ACACAC',
        fontSize: 14,
    },
}));

const SelectedResources = ({ resources, courseId, eventId, setSelectedRooms, setRefetchType }: SelectedResourcesProps) => {
    const currentUser = useUserStore(({ user }) => user);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<RoomWithCapacity>();
    const [resourceToEdit, setResourceToEdit] = useState<RoomWithCapacity & { occupation: number }>();
    const [extendedResources, setExtendedResources] = useState<(RoomWithCapacity & { occupation: number })[]>([]);
    const resourceId = courseId || eventId;

    useEffect(() => {
        const getExtendedResources = async () => {
            try {
                const updatedResources = await Promise.all(
                    resources.map(async (resource) => {
                        const rooms: any[] = await RoomInCourseService.editResourcesHelperFunction(resource._id, resourceId!);
                        const temp = rooms.filter(({ id }) => id !== resourceId);

                        return {
                            ...resource,
                            occupation: temp.reduce((max, room) => Math.max(max, room.occupation), 0),
                        };
                    }),
                );

                setExtendedResources(updatedResources);
            } catch (error) {
                toast.error(i18next.t('newEditResourcesPage.errors.getExtendedResources'));
            }
        };
        getExtendedResources();
    }, [resources, courseId, eventId]);

    const getCorrectResourceType = (room: RoomWithCapacity) => {
        if (room.type === RoomTypes.BEDROOM && room.isStaff) {
            return ResourcesTypes.STAFF_BEDROOM;
        }
        if (room.type === RoomTypes.BEDROOM && !room.isStaff) {
            return ResourcesTypes.SOLDIER_BEDROOM;
        }
        if (room.type === RoomTypes.CLASS) {
            return ResourcesTypes.CLASS;
        }
        return ResourcesTypes.OFFICE;
    };

    const handleRemoveSelectedResource = async (room: RoomWithCapacity) => {
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
            setRefetchType(getCorrectResourceType(room));
            setSelectedRooms(extendedResources.filter(({ _id }) => _id !== room._id));
            setOpenDeleteDialog(false);
            setResourceToDelete(undefined);
            toast.success(i18next.t('newEditResourcesPage.success.removeRoom'), { autoClose: 500 });
        } catch (err) {
            toast.error(i18next.t('newEditResourcesPage.errors.removeRoom'));
        }
    };

    const handleUpdateSelectedResource = async (room: RoomWithCapacity, value: number) => {
        if (!value) {
            handleRemoveSelectedResource(room);
            setOpenEditDialog(false);
            setResourceToEdit(undefined);
        } else
            try {
                if (courseId) await RoomInCourseService.updateOne(room._id, courseId, { occupation: value });
                if (eventId) await RoomInEventService.updateOne(room._id, eventId, { occupation: value });

                setSelectedRooms(
                    extendedResources.map(({ _id, currentCapacity, ...rest }) => {
                        if (_id === room._id) {
                            return { _id, currentCapacity: value, ...rest };
                        }
                        return { _id, currentCapacity, ...rest };
                    }),
                );
                setOpenEditDialog(false);
                setResourceToEdit(undefined);
                toast.success(i18next.t('newEditResourcesPage.success.updateRoom'), { autoClose: 500 });
            } catch (err) {
                toast.error(i18next.t('newEditResourcesPage.errors.updateRoom'));
            }
    };

    return (
        <Box display="flex" gap={2.5} flexDirection="column" width="100%">
            <Box textAlign="left">
                <Typography
                    variant="body1"
                    noWrap
                    sx={{
                        fontSize: '1.5rem',
                    }}
                >
                    {i18next.t('newEditResourcesPage.selectedResources')}
                </Typography>
            </Box>
            <Paper
                sx={{
                    overflow: 'hidden',
                    borderRadius: '1rem',
                    width: '92.9rem',
                    bgcolor: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    boxShadow: 'none',
                }}
            >
                <TableContainer
                    sx={{
                        height: '15rem',
                        '&::-webkit-scrollbar': {
                            display: 'none', // Hide the scrollbar
                        },
                        '&': {
                            msOverflowStyle: 'none', // For IE and Edge to hide the scrollbar
                            scrollbarWidth: 'none', // For Firefox to hide the scrollbar
                        },
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledHeader>{i18next.t('newEditResourcesPage.resource')}</StyledHeader>
                                <StyledHeader align="left">{i18next.t('newEditResourcesPage.name')}</StyledHeader>
                                <StyledHeader align="left">{i18next.t('newEditResourcesPage.state')}</StyledHeader>
                                <StyledHeader align="left">{i18next.t('newEditResourcesPage.max')}</StyledHeader>
                                <StyledHeader align="left">{i18next.t('newEditResourcesPage.current')}</StyledHeader>
                                <StyledHeader align="left" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {extendedResources.map((resource) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <TableRow key={`key-${resource._id}`}>
                                    <TableCell>{i18next.t(`newEditResourcesPage.${getCorrectResourceType(resource)}`)}</TableCell>
                                    <TableCell align="left">{resource.name}</TableCell>
                                    <TableCell align="left">
                                        <State state={resource.currentCapacity === resource.maxCapacity ? StateTypes.FULL : StateTypes.OCCUPIED} />
                                    </TableCell>
                                    <TableCell align="left">
                                        {resource.occupation + resource.currentCapacity}/{resource.maxCapacity}
                                    </TableCell>
                                    <TableCell align="left">{resource.currentCapacity}</TableCell>
                                    <TableCell align="left">
                                        <Box display="flex" gap={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setOpenEditDialog(true);
                                                    setResourceToEdit(resource);
                                                }}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setOpenDeleteDialog(true);
                                                    setResourceToDelete(resource);
                                                }}
                                            >
                                                <DeleteOutline />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {openEditDialog && (
                <EditDialog
                    open={openEditDialog}
                    handleClose={() => setOpenEditDialog(false)}
                    handleUpdateSelectedResource={handleUpdateSelectedResource}
                    resource={resourceToEdit!}
                    getCorrectResourceType={getCorrectResourceType}
                    courseId={courseId}
                    eventId={eventId}
                />
            )}
            {openDeleteDialog && (
                <DeleteDialog
                    open={openDeleteDialog}
                    handleClose={() => setOpenDeleteDialog(false)}
                    handleRemoveSelectedResource={handleRemoveSelectedResource}
                    resource={resourceToDelete!}
                />
            )}
        </Box>
    );
};

export default SelectedResources;
