import React, { useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, CircularProgress, Grid, styled } from '@mui/material';
import { toast } from 'react-toastify';
import i18next from 'i18next';
import { RequestStatuses } from '../../interfaces/request';
import RequestsTab from './requestsTab';
import { environment } from '../../globals';
import { hasPermission } from '../../utils/ProtectedRoutes';
import { RequestsService } from '../../services/requests';
import { useUserStore } from '../../stores/user';

const { permissions } = environment;

export const StyledGrid = styled(Grid)(() => ({
    textAlign: 'right',
}));

const RequestManagementPage = () => {
    const [currentTabNumber, setCurrentTabNumber] = useState('1');
    const [loading, setLoading] = useState(false);
    const [reRenderFlag, setReRenderFlag] = useState(false);
    const [pendingRequestsAmount, setPendingRequestsAmount] = useState<number>(0);
    const [doneRequestsAmount, setDoneRequestsAmount] = useState<number>(0);
    const currentUser = useUserStore(({ user }) => user);

    const reRender = () => {
        setReRenderFlag((current) => !current);
    };

    const getRequestsAmounts = async () => {
        const { genesisId, baseId } = currentUser;
        try {
            setLoading(true);

            const [numberOfPendingRequests, numberOfDoneRequests, numberOFCancelledRequests] = await Promise.all([
                RequestsService.getCount({ status: RequestStatuses.PENDING, requesterId: genesisId, baseId }),
                RequestsService.getCount({ status: RequestStatuses.DONE, requesterId: genesisId, baseId }),
                RequestsService.getCount({ status: RequestStatuses.CANCELLED, requesterId: genesisId, baseId }),
            ]);

            setPendingRequestsAmount(numberOfPendingRequests);
            setDoneRequestsAmount(numberOfDoneRequests + numberOFCancelledRequests);
        } catch (error) {
            toast.error(i18next.t('wizard.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRequestsAmounts();
    }, [reRenderFlag, currentUser.baseId!]);

    const handleTabChange = (_event: React.SyntheticEvent, newTabNumber: string) => {
        setCurrentTabNumber(newTabNumber);
    };

    if (loading)
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30vh' }}>
                <CircularProgress size={80} />
            </div>
        );
    return (
        <TabContext value={currentTabNumber}>
            <TabList onChange={handleTabChange} sx={{ fontWeight: 'bold', color: 'red' }}>
                <Tab sx={{ fontWeight: 'bold' }} label={`${i18next.t('requests.tabs.active')} (${pendingRequestsAmount})`} value="1" />
                <Tab
                    sx={{ fontWeight: 'bold' }}
                    label={
                        hasPermission(permissions.resourceManager, currentUser)
                            ? `${i18next.t('requests.tabs.done')}`
                            : `${i18next.t('requests.tabs.done')} (${doneRequestsAmount})`
                    }
                    value="2"
                />
            </TabList>
            <Box sx={{ overflowY: 'auto', maxHeight: '80vh' }}>
                <TabPanel value="1">
                    <RequestsTab requestStatuses={[RequestStatuses.PENDING]} onEdit={reRender} />
                </TabPanel>
                <TabPanel value="2">
                    <RequestsTab requestStatuses={[RequestStatuses.DONE, RequestStatuses.CANCELLED]} onEdit={reRender} />
                </TabPanel>
            </Box>
        </TabContext>
    );
};

export default RequestManagementPage;
