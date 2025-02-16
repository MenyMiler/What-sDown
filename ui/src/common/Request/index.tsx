import React, { useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@mui/material';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { environment } from '../../globals';
import { PopulatedRequest, RequestStatuses, RequestTypes } from '../../interfaces/request';
import { convertDateTolocaleString } from '../../utils/today';
import { AcceptButton, CancelButton } from './Request.styled';
import { getFormattedItem, RequestDialogContent } from './RequestDialogContent';
import { Status } from './Status';
import { ConfirmationDialog } from './ConfirmationDialog';
import { EditEventOrCourseResource } from './editResource';
import { ResourcesTypes } from '../../utils/resourcesTypes';
import { hasPermission } from '../../utils/ProtectedRoutes';
import { KartoffelUser } from '../../interfaces/kartoffel';
import { RequestsService } from '../../services/requests';
import { useUserStore } from '../../stores/user';
import { addBedroomToCourseOrEventMetadataSchema } from '../../interfaces/request/metadata';
import { GanttDialogContent } from './GanttDialog';

interface IRequest {
    request: PopulatedRequest;
    open: boolean;
    handleClose: () => void;
    rerender: () => void;
}

const { permissions } = environment;

export const RequestDialog = (props: IRequest) => {
    const { request, open, handleClose, rerender } = props;

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [editResource, setEditResource] = useState(false);
    const [isAcceptDialog, setIsAcceptDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEvent, setIsEvent] = useState(false);
    const [resourceType, setResourceType] = useState<ResourcesTypes>(ResourcesTypes.BEDROOM_SOLDIERS);
    const [response, setResponse] = useState('');

    const currentUser = useUserStore(({ user }) => user);

    const courseRequests = ['NEW_CLASS', 'NEW_OFFICE', 'ADD_SOLDIER_BEDROOM_TO_COURSE', 'ADD_STAFF_BEDROOM_TO_COURSE'];

    const eventsRequests = [
        'NEW_CLASS_TO_EVENT',
        'NEW_OFFICE_TO_EVENT',
        'ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE',
        'ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE',
    ];

    const getResourceType = () => {
        switch (request.type) {
            case RequestTypes.NEW_CLASS:
            case RequestTypes.NEW_CLASS_TO_EVENT:
                return ResourcesTypes.CLASS;
            case RequestTypes.NEW_OFFICE:
            case RequestTypes.NEW_OFFICE_TO_EVENT:
                return ResourcesTypes.OFFICE;
            case RequestTypes.ADD_STAFF_BEDROOM_TO_COURSE:
            case RequestTypes.ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE:
                return ResourcesTypes.BEDROOM_STAFF;
            default:
                return ResourcesTypes.BEDROOM_SOLDIERS;
        }
    };

    useEffect(() => {
        if (courseRequests.includes(request.type) || eventsRequests.includes(request.type)) {
            setEditResource(true);
            setIsEvent(eventsRequests.includes(request.type));
            setResourceType(getResourceType());
        }
    }, []);

    const handleAccept = async (status: RequestStatuses) => {
        if (editResource && status === RequestStatuses.DONE) {
            setOpenDialog(true);
            return;
        }

        try {
            const { _id: requestId } = request;
            if (status === RequestStatuses.CANCELLED && !isAcceptDialog) await RequestsService.cancelRequest(requestId, response);
            else if (status === RequestStatuses.DONE) await RequestsService.updateOne(requestId, { status });
            rerender();
            handleClose();
            toast.success(status === RequestStatuses.DONE ? i18next.t('requests.success') : i18next.t('requests.cancelledSuccessfully'));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(i18next.t(`requests.errors.${error.response.data.message}`));
        } finally {
            setOpenConfirmation(false);
        }
    };

    const openConfirmationDialog = (isAccept: boolean) => {
        setIsAcceptDialog(isAccept);
        setOpenConfirmation(true);
    };

    const getUserName = (user: KartoffelUser) => user.fullName ?? `${user.firstName} ${user.lastName}`;

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={request.status === RequestStatuses.PENDING && request.type !== RequestTypes.PERMISSION ? 'xl' : 'sm'}
            fullWidth
            scroll="paper"
            sx={{ textAlign: 'center' }}
        >
            <IconButton onClick={handleClose} sx={{ position: 'absolute', left: 8, top: 8 }}>
                <Close />
            </IconButton>
            {request.status === RequestStatuses.PENDING ? (
                request.type !== RequestTypes.PERMISSION ? (
                    <Grid container sx={{ display: 'flex', width: '95%', height: '100%', ml: '2rem' }} spacing={3}>
                        <Grid item container sx={{ width: '30%' }} direction="column">
                            <Grid
                                item
                                container
                                direction="column"
                                alignItems="start"
                                justifyContent="space-between"
                                sx={{ mb: '1rem', ml: '1rem', mt: '2rem' }}
                            >
                                <Grid item>
                                    <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                        {i18next.t(`requests.types.${request.type}`)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Status status={request.status} />
                                </Grid>
                            </Grid>

                            <Grid item container direction="column" alignItems="flex-start" spacing={1} sx={{ ml: '1rem', mb: '1rem' }}>
                                <Grid item>{getFormattedItem(i18next.t('requests.createdAt'), convertDateTolocaleString(request.createdAt))}</Grid>
                                <Grid item>
                                    <Typography>{request.base.name}</Typography>
                                </Grid>
                                <Grid item>{getFormattedItem(i18next.t('requests.updatedAt'), convertDateTolocaleString(request.updatedAt))}</Grid>
                                <Grid item>{getFormattedItem(i18next.t('requests.requestedBy'), getUserName(request.user))} </Grid>
                            </Grid>
                            <RequestDialogContent request={request} />

                            {hasPermission(permissions.resourceManager, currentUser) && (
                                <Grid item direction="row" justifyContent="center" sx={{ mt: '3rem' }}>
                                    <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                                        <AcceptButton
                                            variant="contained"
                                            onClick={() => (editResource ? setOpenDialog(true) : openConfirmationDialog(true))}
                                        >
                                            {i18next.t('requests.accept')}
                                        </AcceptButton>
                                        <CancelButton variant="contained" onClick={() => openConfirmationDialog(false)}>
                                            {i18next.t('requests.cancel')}
                                        </CancelButton>
                                    </DialogActions>
                                </Grid>
                            )}
                        </Grid>
                        <Grid item container sx={{ width: '1px' }} direction="column">
                            <Divider sx={{ height: '100%' }} orientation="vertical" flexItem />
                        </Grid>
                        {hasPermission(permissions.resourceManager, currentUser) && <GanttDialogContent />}
                    </Grid>
                ) : (
                    <Grid item container sx={{ width: '95%' }} direction="column">
                        <Grid
                            item
                            container
                            direction="column"
                            alignItems="start"
                            justifyContent="space-between"
                            sx={{ mb: '1rem', ml: '1rem', mt: '2rem' }}
                        >
                            <Grid item>
                                <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>{i18next.t(`requests.types.${request.type}`)}</Typography>
                            </Grid>
                            <Grid item>
                                <Status status={request.status} />
                            </Grid>
                        </Grid>

                        <Grid item container direction="column" alignItems="flex-start" spacing={1} sx={{ ml: '1rem', mb: '1rem' }}>
                            <Grid item>{getFormattedItem(i18next.t('requests.createdAt'), convertDateTolocaleString(request.createdAt))}</Grid>
                            <Grid item>
                                <Typography>{request.base.name}</Typography>
                            </Grid>
                            <Grid item>{getFormattedItem(i18next.t('requests.updatedAt'), convertDateTolocaleString(request.updatedAt))}</Grid>
                            <Grid item>{getFormattedItem(i18next.t('requests.requestedBy'), getUserName(request.user))} </Grid>
                        </Grid>
                        <RequestDialogContent request={request} />

                        {hasPermission(permissions.resourceManager, currentUser) && (
                            <Grid item direction="row" justifyContent="center" sx={{ mt: '3rem' }}>
                                <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                                    <AcceptButton
                                        variant="contained"
                                        onClick={() => (editResource ? setOpenDialog(true) : openConfirmationDialog(true))}
                                    >
                                        {i18next.t('requests.accept')}
                                    </AcceptButton>
                                    <CancelButton variant="contained" onClick={() => openConfirmationDialog(false)}>
                                        {i18next.t('requests.cancel')}
                                    </CancelButton>
                                </DialogActions>
                            </Grid>
                        )}
                    </Grid>
                )
            ) : (
                <>
                    <DialogTitle>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ mx: 'auto', mt: '2rem', width: '95%' }}>
                            <Grid item>
                                <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>{i18next.t(`requests.types.${request.type}`)}</Typography>
                            </Grid>
                            <Grid item>
                                <Status status={request.status} />
                            </Grid>
                        </Grid>

                        <Grid container direction="column" alignItems="flex-start" spacing={1} sx={{ ml: '1rem' }}>
                            <Grid item>{getFormattedItem(i18next.t('requests.createdAt'), convertDateTolocaleString(request.createdAt))}</Grid>
                            <Grid item>
                                <Typography>{request.base.name}</Typography>
                            </Grid>
                            <Grid item>{getFormattedItem(i18next.t('requests.updatedAt'), convertDateTolocaleString(request.updatedAt))}</Grid>
                            <Grid item>{getFormattedItem(i18next.t('requests.requestedBy'), getUserName(request.user))} </Grid>
                        </Grid>
                    </DialogTitle>
                    <RequestDialogContent request={request} />
                </>
            )}
            {request.status === RequestStatuses.PENDING && hasPermission(permissions.resourceManager, currentUser) && (
                <>
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
                        <DialogContent>
                            <EditEventOrCourseResource
                                request={request}
                                resourceType={resourceType}
                                setOpenDialog={setOpenDialog}
                                setOpenConfirmation={setOpenConfirmation}
                                setEditResource={setEditResource}
                                courseId={(request.metaData as addBedroomToCourseOrEventMetadataSchema).courseId}
                                eventId={(request.metaData as addBedroomToCourseOrEventMetadataSchema).eventId}
                                handleClose={() => {
                                    handleClose();
                                    rerender();
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                    <ConfirmationDialog
                        isAcceptDialog={isAcceptDialog}
                        open={openConfirmation}
                        handleAccept={handleAccept}
                        handleClose={() => setOpenConfirmation(false)}
                        response={response}
                        setResponse={setResponse}
                    />
                </>
            )}
        </Dialog>
    );
};
