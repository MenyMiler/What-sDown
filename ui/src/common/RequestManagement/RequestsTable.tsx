/* eslint-disable no-nested-ternary */
import { Grid, LinearProgress, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../globals';
import { PopulatedRequest, RequestStatuses, RequestsTableData, RequestsTypesCategories } from '../../interfaces/request';
import { Types as UserTypes } from '../../interfaces/user';
import { RequestsService } from '../../services/requests';
import { useUserStore } from '../../stores/user';
import { dateToString } from '../../utils';
import { RequestDialog } from '../Request';
import { StyledCalendarIcon } from '../YearlyGraph/YearlyGraph.styled';
import { StyledTableCell, StyledTableContainer } from './RequestManagement.styled';

interface IOpenRequestsProps {
    requestStatuses: RequestStatuses[];
    requestCategory: RequestsTypesCategories;
    onEdit: () => void;
}

const tableCategories = ['requestType', 'courseOrEventName', 'startDate', 'endDate', 'requesterName', 'baseName', 'branch', 'requestStatus'];

const colors = {
    green: '#599a3f',
    orange: '#ffa500',
    red: '#d94040',
};

const getStatusColor = (status: RequestStatuses) => {
    switch (status) {
        case RequestStatuses.CANCELLED:
            return colors.red;

        case RequestStatuses.PENDING:
            return colors.orange;

        case RequestStatuses.DONE:
            return colors.green;

        default:
            return '#000';
    }
};

const RequestsTable = ({ requestStatuses, requestCategory, onEdit }: IOpenRequestsProps) => {
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [populatedRequest, setPopulatedRequest] = useState<PopulatedRequest | null>(null);
    const [rows, setRows] = useState<RequestsTableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [reRenderFlag, setReRenderFlag] = useState(false);
    const [subReRenderFlag, setSubReRenderFlag] = useState(false);
    const currentUser = useUserStore(({ user }) => user);

    const getDateOrNoDateMessage = (date?: Date) => (date ? dateToString(date) : i18next.t('yearlyGraph.noDate'));

    const handleCloseDialog = () => {
        setSelectedRequestId(null);
        setPopulatedRequest(null);
    };

    const getPopulatedRequest = async () => selectedRequestId && setPopulatedRequest(await RequestsService.getById(selectedRequestId, true));

    const getRequests = async () => {
        setLoading(true);

        // ? this is outside the query because of incompatibility between prettier and ESLint;
        const requestQuery = {
            ...(!(currentUser.currentUserType! === UserTypes.SUPERADMIN || currentUser.currentUserType! === UserTypes.RESOURCE_MANAGER) && {
                requesterId: currentUser.genesisId!,
            }),
            limit: environment.pagination.limit,
            step,
        };

        try {
            // Getting the data according to userType and current step progression;
            const newRows: RequestsTableData[] = await RequestsService.getRowsToDisplay(requestQuery, requestStatuses, requestCategory);

            // Checking if the amount of requests is done, if so no more infinite scroll;
            if (!newRows.length) {
                setHasMore(false);
                return;
            }
            // Updating the states accordingly;
            setRows((current) => [...current, ...newRows]);
            setStep(step + 1);
        } catch (error) {
            toast.error(i18next.t('error.config'));
            setRows([]);
            // setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(0);
        setHasMore(true);
        setRows([]);
    };

    const rerender = () => {
        setReRenderFlag(true);
        onEdit();
    };

    useEffect(() => {
        if (subReRenderFlag) {
            getRequests();
            setSubReRenderFlag(false);
        }
    }, [subReRenderFlag]);

    useEffect(() => {
        setSubReRenderFlag(true);
        reset();
    }, [reRenderFlag]);

    useEffect(() => {
        getPopulatedRequest();
    }, [!!selectedRequestId]);

    return (
        <InfiniteScroll scrollableTarget="table" next={getRequests} hasMore={hasMore} loader={undefined} dataLength={rows.length}>
            <StyledTableContainer id="table">
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {tableCategories.map((category) => (
                                <StyledTableCell key={category}>{i18next.t(`requestManagement.${category}`)}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map(
                            ({ requestId, requestType, courseOrEventName, startDate, endDate, requesterName, baseName, branch, requestStatus }) => (
                                <TableRow
                                    sx={{ backgroundColor: '#fff', '&:hover': { cursor: 'pointer' } }}
                                    hover
                                    key={uuidv4()}
                                    onClick={() => setSelectedRequestId(requestId)}
                                >
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>
                                        {i18next.t(`requestDetailsModal.types.${requestType}`)}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{courseOrEventName}</StyledTableCell>
                                    <StyledTableCell>
                                        <Grid container alignItems="center">
                                            <StyledCalendarIcon />
                                            {getDateOrNoDateMessage(startDate)}
                                        </Grid>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Grid container alignItems="center">
                                            <StyledCalendarIcon />
                                            {getDateOrNoDateMessage(endDate)}
                                        </Grid>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{requesterName}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{baseName}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{branch.name || '-'}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold', color: getStatusColor(requestStatus) }}>
                                        {i18next.t(`requests.${requestStatus}`)}
                                    </StyledTableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
                {loading ? (
                    <LinearProgress />
                ) : !rows.length ? (
                    <Typography sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>{i18next.t('noData')}</Typography>
                ) : null}
                {populatedRequest && (
                    <RequestDialog request={populatedRequest} open={Boolean(populatedRequest)} handleClose={handleCloseDialog} rerender={rerender} />
                )}
            </StyledTableContainer>
        </InfiniteScroll>
    );
};

export default RequestsTable;
