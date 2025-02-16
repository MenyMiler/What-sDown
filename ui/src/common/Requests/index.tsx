/* eslint-disable react/no-array-index-key */
import { Box, Divider, Typography } from '@mui/material';
import axios from 'axios';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PopulatedRequest, RequestStatuses } from '../../interfaces/request';
import { addBedroomToCourseOrEventMetadataSchema, AddClassOrOfficeToCourseOrEventMetadata } from '../../interfaces/request/metadata';
import { Types as UserTypes } from '../../interfaces/user';
import { RequestsService } from '../../services/requests';
import { useUserStore } from '../../stores/user';
import AlertModal from './AlertModal';
import MySingleRequest from './MySingleRequest';
import { Header, RequestsCard } from './Requests.styled';
import SingleRequest from './SingleRequest';

const Requests = () => {
    const currentUser = useUserStore(({ user }) => user);
    const [userRequests, setUserRequests] = useState<PopulatedRequest[]>([]);
    const [requestsUserCanApprove, setRequestsUserCanApprove] = useState<PopulatedRequest[]>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [requestStatus, setRequestStatus] = useState<'CANCELLED' | 'DONE'>('CANCELLED');
    const [requestId, setRequestId] = useState<string>('');
    const navigate = useNavigate();

    const getRequests = async () => {
        try {
            setRequestsUserCanApprove(await RequestsService.getByQuery({ baseId: currentUser.baseId!, populate: true }));
        } catch (error) {
            toast.error(i18next.t('requests.errors.mongoError'));
        }
    };

    const getRequestsUserCanApprove = async () => {
        try {
            const result = await RequestsService.getRequestsForApproval(currentUser.baseId!);
            setRequestsUserCanApprove(result);
        } catch (error) {
            toast.error(i18next.t('requests.errors.mongoError'));
        }
    };

    const getMyRequests = async () => {
        const result = await RequestsService.getByQuery({ requesterId: currentUser.genesisId, populate: true });
        setUserRequests(result);
    };

    const changeRequestStatus = async (request: string, status: 'CANCELLED' | 'DONE') => {
        setRequestStatus(status);
        setRequestId(request);
        setOpenAlertDialog(true);
    };

    const handleRequest = async () => {
        setOpenAlertDialog(false);
        const currentRequest = await RequestsService.getById(requestId, false);
        const courseRequests = ['NEW_CLASS', 'NEW_OFFICE', 'ADD_SOLDIER_BEDROOM_TO_COURSE', 'ADD_STAFF_BEDROOM_TO_COURSE'];
        const eventsRequests = [
            'NEW_CLASS_TO_EVENT',
            'NEW_OFFICE_TO_EVENT',
            'ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE',
            'ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE',
        ];
        try {
            await RequestsService.updateOne(requestId, { status: requestStatus as RequestStatuses });
            toast.success(requestStatus === 'DONE' ? i18next.t('requests.success') : i18next.t('requests.cancelledSuccessfully'));
            getRequests();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(i18next.t(`requests.errors.${error.response.data.message}`));
        }
        if (courseRequests.includes(currentRequest.type))
            navigate(
                `../courses/${
                    (currentRequest.metaData as AddClassOrOfficeToCourseOrEventMetadata | addBedroomToCourseOrEventMetadataSchema).courseId
                }/edit`,
            );
        else if (eventsRequests.includes(currentRequest.type))
            navigate(
                `../events/${
                    (currentRequest.metaData as AddClassOrOfficeToCourseOrEventMetadata | addBedroomToCourseOrEventMetadataSchema).eventId
                }/edit`,
            );
    };

    // TODO make interval that after 1/2 min update the requests
    // useEffect(() => {
    //     const interval = setInterval(getRequests, 3000);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        const getData = async () => {
            if (currentUser.currentUserType! === UserTypes.SUPERADMIN) {
                await getRequests();
            } else {
                await Promise.all([getMyRequests(), getRequestsUserCanApprove()]);
            }
        };

        getData();
    }, [currentUser]);

    return (
        <>
            <AlertModal
                status={requestStatus}
                open={openAlertDialog}
                handleClose={() => setOpenAlertDialog(false)}
                handleSendRequest={() => handleRequest()}
            />
            <RequestsCard>
                {currentUser.currentUserType! === UserTypes.SUPERADMIN ? (
                    <Box sx={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                        <Header sx={{ mb: '0.5rem' }}>{i18next.t('requests.requests')}</Header>
                        <Divider />
                        {requestsUserCanApprove.length === 0 ? (
                            <Typography sx={{ mt: '0.5rem' }} variant="subtitle1">
                                {i18next.t('requests.noRequestsAvailableCurrently')}
                            </Typography>
                        ) : (
                            <Box sx={{ overflowY: 'auto', height: '18.5rem' }}>
                                {requestsUserCanApprove.map((request, index) => (
                                    <SingleRequest key={index} request={request} changeRequestStatus={changeRequestStatus} />
                                ))}
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                        <Header sx={{ mb: '0.5rem' }}>{i18next.t('requests.myRequests')}</Header>
                        <Divider />
                        {userRequests.length + requestsUserCanApprove.length === 0 ? (
                            <Typography sx={{ mt: '0.5rem' }} variant="subtitle1">
                                {i18next.t('requests.noRequestsAvailableCurrently')}
                            </Typography>
                        ) : (
                            <Box sx={{ overflowY: 'auto', height: '22rem' }}>
                                <Box sx={{ overflowY: 'auto', paddingBottom: '1rem' }}>
                                    {userRequests.map((request, index) => (
                                        <MySingleRequest key={index} request={request} />
                                    ))}
                                </Box>
                                <Box sx={{ overflowY: 'auto', height: '18.5rem' }}>
                                    {requestsUserCanApprove.map((request, index) => (
                                        <SingleRequest key={index} request={request} changeRequestStatus={changeRequestStatus} />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </RequestsCard>
        </>
    );
};

export default Requests;
