/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { ArchiveOutlined, ContentCopy, MoreHorizOutlined, RadioButtonUnchecked, TaskAlt, UnarchiveOutlined } from '@mui/icons-material';
import { Box, Button, Grid, LinearProgress, Popover, Table, TableBody, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { customIcons } from '../../../common/Modals/sendFeedback/SendFeedback';
import { StyledCalendarIcon, StyledTableCell, StyledTableOfFeedbacksContainer } from '../../../common/YearlyGraph/YearlyGraph.styled';
import { environment } from '../../../globals';
import { FeedbackTypes, PopulatedFeedback } from '../../../interfaces/feedback';
import { FeedbacksService } from '../../../services/feedbacks';
import { FeedbacksArchiveService } from '../../../services/feedbacksArchive';
import { dateToString } from '../../../utils';
import { FeedbackDialog } from './FeedbackDialog';

const tableCategories = ['seen', 'createdAt', 'name', 'job', 'category', 'description', 'urgency', 'rating', 'moreDetails', 'archive'];
const unSortedCategories = ['seen', 'name', 'job', 'moreDetails', 'archive'];

enum Directions {
    asc = 'asc',
    desc = 'desc',
}
interface IFeedbacksTableProps {
    type: string;
    reRenderAllFlag: boolean;
    setReRenderAllFlag: (value: boolean) => void;
    filters?: any;
    setActiveFeedbacksForExcel?: (value: React.SetStateAction<PopulatedFeedback[]>) => void;
}

const FeedbacksTable = ({ type, reRenderAllFlag, setReRenderAllFlag, filters = {}, setActiveFeedbacksForExcel }: IFeedbacksTableProps) => {
    const [populatedFeedback, setPopulatedFeedback] = useState<PopulatedFeedback | null>(null);
    const [rowsOfPopulatedFeedbacks, setRowsOfPopulatedFeedbacks] = useState<PopulatedFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [reRenderFlag, setReRenderFlag] = useState(true);
    const [subReRenderFlag, setSubReRenderFlag] = useState(false);

    const [sort, setSort] = useState({});
    const [activeSort, setActive] = useState<number>(-1);
    const [sortDirection, setSortDirection] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClickOnName = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNamePopover = () => {
        setAnchorEl(null);
    };

    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const getDateOrNoDateMessage = (date?: Date) => (date ? dateToString(date) : i18next.t('yearlyGraph.noDate'));

    const handleArchive = async (feedbackId: string) => {
        if (type === FeedbackTypes.NORMAL) await FeedbacksService.moveToArchive(feedbackId);
        else await FeedbacksService.getBackFromArchive(feedbackId);
        setReRenderAllFlag(!reRenderAllFlag);
    };

    const handleClickOnFeedback = (feedbackId: string) => {
        setPopulatedFeedback(rowsOfPopulatedFeedbacks.find(({ _id }) => _id === feedbackId)!);
    };

    const handleViewedFeedback = async (feedbackId: string, seen: boolean) => {
        if (type === FeedbackTypes.NORMAL) await FeedbacksService.updateOne(feedbackId, { seen });
        else await FeedbacksArchiveService.updateOne(feedbackId, { seen });
        const rowsOfPopulatedFeedbacksCopy = [...rowsOfPopulatedFeedbacks];
        const updatedFeedbackIndex = rowsOfPopulatedFeedbacksCopy.findIndex((feedback) => feedback._id === feedbackId);
        rowsOfPopulatedFeedbacksCopy[updatedFeedbackIndex] = { ...rowsOfPopulatedFeedbacksCopy[updatedFeedbackIndex], seen };
        setRowsOfPopulatedFeedbacks(rowsOfPopulatedFeedbacksCopy);
    };

    const handleCloseDialog = (feedbackId: string) => {
        setPopulatedFeedback(null);
        handleViewedFeedback(feedbackId, true);
    };

    const getPopulatedFeedbacks = async () => {
        setLoading(true);

        const feedbackQuery = {
            ...sort,
            ...filters,
            limit: environment.pagination.limit,
            step,
        };

        try {
            const newFeedbacks =
                type === FeedbackTypes.NORMAL
                    ? await FeedbacksService.getByQuery({ ...feedbackQuery, populate: true })
                    : await FeedbacksArchiveService.getByQuery({ ...feedbackQuery, populate: true });

            if (!newFeedbacks.length) {
                setHasMore(false);
                return;
            }
            setRowsOfPopulatedFeedbacks([...rowsOfPopulatedFeedbacks, ...(newFeedbacks as PopulatedFeedback[])]);
            setStep(step + 1);
        } catch (error) {
            toast.error(i18next.t('error.config'));
            setRowsOfPopulatedFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(0);
        setHasMore(true);
        setRowsOfPopulatedFeedbacks([]);
    };

    useEffect(() => {
        setSubReRenderFlag(true);
        reset();
    }, [filters]);

    useEffect(() => {
        if (subReRenderFlag) {
            getPopulatedFeedbacks();
            setSubReRenderFlag(false);
            if (setActiveFeedbacksForExcel && type === FeedbackTypes.NORMAL) setActiveFeedbacksForExcel(rowsOfPopulatedFeedbacks);
        }
    }, [subReRenderFlag]);

    useEffect(() => {
        if (setActiveFeedbacksForExcel && type === FeedbackTypes.NORMAL) setActiveFeedbacksForExcel(rowsOfPopulatedFeedbacks);
    }, [rowsOfPopulatedFeedbacks]);

    useEffect(() => {
        setSubReRenderFlag(!subReRenderFlag);
        reset();
    }, [reRenderFlag, reRenderAllFlag]);

    const seenButton = (feedbackId: string, seen: boolean) => (
        <Button onClick={() => handleViewedFeedback(feedbackId, !seen)}>
            {!seen ? <RadioButtonUnchecked sx={{ color: 'black' }} /> : <TaskAlt sx={{ color: 'black' }} />}
        </Button>
    );

    const dateValue = (createdAt: Date) => (
        <Grid container alignItems="center">
            <StyledCalendarIcon />
            {getDateOrNoDateMessage(createdAt)}
        </Grid>
    );

    const moreDetailsButton = (feedbackId: string) => (
        <Button onClick={() => handleClickOnFeedback(feedbackId)}>
            <MoreHorizOutlined sx={{ color: 'black' }} />
        </Button>
    );

    const archiveButton = (feedbackId: string) => (
        <Button onClick={() => handleArchive(feedbackId)}>
            {type === FeedbackTypes.NORMAL ? <ArchiveOutlined sx={{ color: 'black' }} /> : <UnarchiveOutlined sx={{ color: 'black' }} />}
        </Button>
    );

    const popoverProperty = (key: string, value: string | string[]) => {
        if (!value) return null;

        const translatedValue = typeof value === 'string' ? value : value.join(', ');

        return (
            <Typography>
                {i18next.t(`feedbackManagementPage.${key}`)}: {translatedValue}
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(translatedValue);
                        toast.success(i18next.t('feedbackManagementPage.copiedSuccessfully'));
                    }}
                >
                    <ContentCopy sx={{ color: 'black', fontSize: 'x-large' }} />
                </Button>
            </Typography>
        );
    };

    const namePopover = (name: string, personalNumber: string, mail: string, phoneNumber: string, basesNames: string[]) => (
        <>
            <Button onClick={handleClickOnName}>{name}</Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseNamePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                TransitionProps={{
                    style: { boxShadow: '0px 3px 8px 2px rgba(0,0,0,0.12)' },
                }}
            >
                <Box sx={{ p: 2 }}>
                    {popoverProperty('personalNumber', personalNumber)}
                    {popoverProperty('mail', mail)}
                    {popoverProperty('phoneNumber', phoneNumber)}
                    {popoverProperty('basesNames', basesNames)}
                </Box>
            </Popover>
        </>
    );

    const handleSort = (index: number) => {
        const newSortDirection = index !== activeSort ? false : !sortDirection;
        setSortDirection(newSortDirection);
        setActive(index);
        setSort({ sort: tableCategories[index], order: newSortDirection ? -1 : 1 });
        setReRenderFlag((curr) => !curr);
    };

    return (
        <InfiniteScroll
            scrollableTarget="table"
            next={getPopulatedFeedbacks}
            hasMore={hasMore}
            loader={undefined}
            dataLength={rowsOfPopulatedFeedbacks.length}
        >
            <StyledTableOfFeedbacksContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {tableCategories.map((category, index) => (
                                <StyledTableCell key={category}>
                                    {i18next.t(`feedbackManagementPage.${category}`)}
                                    {!unSortedCategories.includes(category) && (
                                        <TableSortLabel
                                            active={activeSort === index}
                                            direction={sortDirection ? Directions.desc : Directions.asc}
                                            onClick={() => handleSort(index)}
                                        />
                                    )}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowsOfPopulatedFeedbacks?.map(
                            ({
                                name,
                                job,
                                category,
                                description,
                                rating,
                                seen,
                                urgency,
                                createdAt,
                                _id,
                                personalNumber,
                                mail,
                                phoneNumber,
                                basesNames,
                            }) => (
                                <TableRow
                                    sx={{
                                        backgroundColor: !seen ? '#F5F8FF' : '#fff',
                                        '&:hover': { cursor: 'pointer' },
                                    }}
                                    key={_id}
                                >
                                    {[
                                        seenButton(_id, seen),
                                        dateValue(createdAt),
                                        namePopover(name, personalNumber, mail, phoneNumber, basesNames),
                                        job,
                                        i18next.t(`feedbackManagementPage.categoryTypes.${category}`),
                                        description.length > 10 ? description.substring(0, 9).concat('...') : description,
                                        i18next.t(`feedbackManagementPage.urgencyTypes.${urgency}`),
                                        customIcons[rating].icon,
                                        moreDetailsButton(_id),
                                        archiveButton(_id),
                                    ].map((value, index) => (
                                        <StyledTableCell key={index} sx={{ fontWeight: 'bold' }}>
                                            {value}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
                {loading ? (
                    <LinearProgress />
                ) : (
                    !rowsOfPopulatedFeedbacks.length && (
                        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>{i18next.t('noData')}</Typography>
                    )
                )}
                {populatedFeedback && (
                    <FeedbackDialog populatedFeedback={populatedFeedback} open={Boolean(populatedFeedback)} handleClose={handleCloseDialog} />
                )}
            </StyledTableOfFeedbacksContainer>
        </InfiniteScroll>
    );
};

export default FeedbacksTable;
