/* eslint-disable indent */
/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
import { WarningAmber } from '@mui/icons-material';
import { Box, Grid, LinearProgress, Table, TableBody, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PopulatedCourse } from '../../interfaces/course';
import { Types } from '../../interfaces/courseTemplate';
import { Types as UserTypes } from '../../interfaces/user';
import { EditResourcesLocationState } from '../../pages/EditResources';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';
import { dateToString } from '../../utils';
import CourseDetails from '../ganttTask/components/modal/CourseDetails';
import { StyledAddResourceButton, StyledCalendarIcon, StyledTableCell, StyledTableContainer, StyledViewResourceButton } from './YearlyGraph.styled';
import { PopulatedEvent } from '../../interfaces/event';
import { EventsService } from '../../services/events';
import EventDetails from '../ganttTask/components/modal/EventDetails';

interface IYearlyGraphProps {
    rows: (PopulatedCourse | PopulatedEvent)[];
    loading: boolean;
    hasMore: boolean;
    setSort: React.Dispatch<React.SetStateAction<{}>>;
    getRows: () => void;
    dataType: 'event' | 'course';
}
enum directions {
    asc = 'asc',
    desc = 'desc',
}

enum sortsByIndex {
    COURSE_NAME,
    RESOURCES,
    START_DATE,
    END_DATE,
}

enum sorts {
    courseName = 'name',
    resources = 'resources',
    startDate = 'startDate',
    endDate = 'endDate',
}

const YearlyGraph = (props: IYearlyGraphProps) => {
    const { rows, loading, setSort, hasMore, getRows, dataType } = props;
    const currentUser = useUserStore(({ user }) => user);
    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
    const tableCategories =
        dataType === 'course' ? ['courseName', 'resources', 'startDate', 'endDate'] : ['eventName', 'resources', 'startDate', 'endDate'];
    const militaryPlanningTableCategories = ['courseName', 'details', 'startDate', 'endDate'];

    const { data: course } = useQuery({
        queryKey: ['courses', selectedResourceId],
        queryFn: () => CoursesService.getById(selectedResourceId as string, true),
        meta: { errorMessage: i18next.t('wizard.error') },
        enabled: !!selectedResourceId && dataType === 'course',
    });

    const { data: event } = useQuery({
        queryKey: ['events', selectedResourceId],
        queryFn: () => EventsService.getById(selectedResourceId as string, true),
        meta: { errorMessage: i18next.t('wizard.error') },
        enabled: !!selectedResourceId && dataType === 'event',
    });

    const [activeSort, setActive] = useState<number>(-1);
    const [sortDirection, setSortDirection] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleClose = () => {
        setSelectedResourceId(null);
    };

    const handleSort = (index: number) => {
        let sort = '';
        let order = false;

        setSortDirection((curr) => {
            if (index !== activeSort) return false;
            order = !curr;
            return !curr;
        });
        setActive(index);

        switch (index) {
            case sortsByIndex.COURSE_NAME:
                sort = sorts.courseName;
                break;
            case sortsByIndex.START_DATE:
                sort = sorts.startDate;
                break;
            case sortsByIndex.END_DATE:
                sort = sorts.endDate;
                break;

            default:
                break;
        }

        setSort({ sort, order: order ? 1 : -1 });
    };

    const shouldDisplayWarning = (type: Types, rakaz?: number | null, actual?: number | null) =>
        type === Types.PRE_ENLISTMENT && rakaz && actual && actual > rakaz;
    return (
        <InfiniteScroll scrollableTarget="table" next={getRows} hasMore={hasMore} loader={undefined} dataLength={rows.length}>
            <StyledTableContainer id="table">
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {(currentUser.currentUserType !== UserTypes.PLANNING ? tableCategories : militaryPlanningTableCategories).map(
                                (category, index) => (
                                    <StyledTableCell key={category}>
                                        {index !== sortsByIndex.RESOURCES ? (
                                            <TableSortLabel
                                                active={activeSort === index}
                                                direction={sortDirection ? directions.desc : directions.asc}
                                                onClick={() => handleSort(index)}
                                            >
                                                {i18next.t(`yearlyGraph.table.category.${category}`)}
                                            </TableSortLabel>
                                        ) : (
                                            i18next.t(`yearlyGraph.table.category.${category}`)
                                        )}
                                    </StyledTableCell>
                                ),
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataType === 'course'
                            ? (rows as PopulatedCourse[]).map(
                                  ({
                                      _id: courseId,
                                      base: { _id: baseId },
                                      rooms,
                                      name,
                                      startDate,
                                      endDate,
                                      type,
                                      durations: { rakaz, actual } = {},
                                  }) => (
                                      <TableRow
                                          sx={{
                                              backgroundColor:
                                                  rooms.length || currentUser.currentUserType! === UserTypes.PLANNING
                                                      ? 'yearlyGraphTable.viewResource'
                                                      : 'yearlyGraphTable.addResource',
                                          }}
                                          key={uuidv4()}
                                      >
                                          <StyledTableCell sx={{ fontWeight: 'bold' }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                  {name}
                                                  {shouldDisplayWarning(type, rakaz, actual) ? <WarningAmber sx={{ color: 'red' }} /> : null}
                                              </Box>
                                          </StyledTableCell>
                                          <StyledTableCell>
                                              {currentUser.currentUserType !== UserTypes.PLANNING && (
                                                  <StyledAddResourceButton
                                                      onClick={() => {
                                                          const courseState: EditResourcesLocationState = {
                                                              state: {
                                                                  courseId,
                                                                  name,
                                                                  baseId,
                                                                  startDate,
                                                                  endDate,
                                                              },
                                                          };
                                                          navigate('../course/edit', courseState);
                                                      }}
                                                      variant="outlined"
                                                  >
                                                      {i18next.t('yearlyGraph.editResources')}
                                                  </StyledAddResourceButton>
                                              )}
                                              <StyledViewResourceButton onClick={() => setSelectedResourceId(courseId)} variant="outlined">
                                                  {i18next.t('yearlyGraph.viewResources')}
                                              </StyledViewResourceButton>
                                          </StyledTableCell>
                                          <StyledTableCell>
                                              <Grid container alignItems="center">
                                                  <StyledCalendarIcon />
                                                  {dateToString(startDate)}
                                              </Grid>
                                          </StyledTableCell>
                                          <StyledTableCell>
                                              <Grid container alignItems="center">
                                                  <StyledCalendarIcon />
                                                  {dateToString(endDate)}
                                              </Grid>
                                          </StyledTableCell>
                                      </TableRow>
                                  ),
                              )
                            : (rows as PopulatedEvent[]).map(({ _id: eventId, base: { _id: baseId }, rooms, name, startDate, endDate }) => (
                                  <TableRow
                                      sx={{
                                          backgroundColor:
                                              rooms.length || currentUser.currentUserType! === UserTypes.PLANNING
                                                  ? 'yearlyGraphTable.viewResource'
                                                  : 'yearlyGraphTable.addResource',
                                      }}
                                      key={uuidv4()}
                                  >
                                      <StyledTableCell sx={{ fontWeight: 'bold' }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>{name}</Box>
                                      </StyledTableCell>
                                      <StyledTableCell>
                                          {currentUser.currentUserType !== UserTypes.PLANNING && (
                                              <StyledAddResourceButton
                                                  onClick={() => {
                                                      const eventState: EditResourcesLocationState = {
                                                          state: {
                                                              eventId,
                                                              name,
                                                              baseId,
                                                              startDate,
                                                              endDate,
                                                          },
                                                      };
                                                      navigate('../event/edit', eventState);
                                                  }}
                                                  variant="outlined"
                                              >
                                                  {i18next.t('yearlyGraph.editResources')}
                                              </StyledAddResourceButton>
                                          )}
                                          {/* // TODO impl the viewResources btn for events  */}
                                          {/* <StyledViewResourceButton onClick={() => setSelectedResourceId(eventId)} variant="outlined">
                                              {i18next.t('yearlyGraph.viewResources')}
                                          </StyledViewResourceButton> */}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                          <Grid container alignItems="center">
                                              <StyledCalendarIcon />
                                              {dateToString(startDate)}
                                          </Grid>
                                      </StyledTableCell>
                                      <StyledTableCell>
                                          <Grid container alignItems="center">
                                              <StyledCalendarIcon />
                                              {dateToString(endDate)}
                                          </Grid>
                                      </StyledTableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
                {loading ? (
                    <LinearProgress />
                ) : !rows.length ? (
                    <Typography sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>{i18next.t('noData')}</Typography>
                ) : null}
            </StyledTableContainer>
            {course && selectedResourceId && <CourseDetails populatedCourse={course} open={!!course} handleClose={handleClose} />}
            {event && selectedResourceId && <EventDetails populatedEvent={event} open={!!event} handleClose={handleClose} />}
        </InfiniteScroll>
    );
};

export default YearlyGraph;
