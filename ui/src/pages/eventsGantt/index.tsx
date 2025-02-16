/* eslint-disable react/require-default-props */
import { Box, Grid } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Legend from '../../common/Legend';
import Sorts, { PageType } from '../../common/filterSelect';
import { Task, ViewMode } from '../../common/ganttTask';
import { Gantt } from '../../common/ganttTask/components/gantt/gantt';
import { environment } from '../../globals';
import { PopulatedEvent } from '../../interfaces/event';
import { getColumnWidth } from '../../utils/gantt';
import EventDetails from './EventDetails';
import { EventsService } from '../../services/events';
import { useUserStore } from '../../stores/user';
import { Status } from '../../common/ganttTask/types/public-types';

const colors = environment.colors.coursesGantt;

interface EventsGanttProps {
    miniGanttFlag?: boolean;
}

const EventsGantt = ({ miniGanttFlag = false }: EventsGanttProps) => {
    const currentUser = useUserStore(({ user }) => user);
    const [resources, setResources] = React.useState<Task[]>([]);
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<any>({ isConnectedToCourseFilter: 'all' });
    const [selectedEvent, setSelectedEvent] = React.useState<PopulatedEvent>({} as PopulatedEvent);
    const [view, setView] = React.useState<ViewMode>(ViewMode.Week);

    const handleClose = () => setOpenModal(false);

    const getCourseStatus = (start: Date, end: Date) => {
        const today = new Date();
        if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) return Status.Active;
        if (today.getTime() > start.getTime()) return Status.Done;
        return Status.Future;
    };

    const handleSelect = async (task: Task) => {
        const event = await EventsService.getById(task.id, true);

        setSelectedEvent(event);
        setOpenModal(true);
    };

    useEffect(() => {
        const getEvents = async () => {
            const { viewMode, isConnectedToCourseFilter, ...rest } = filter;
            if (viewMode) setView(viewMode);

            if (isConnectedToCourseFilter !== 'all') rest.isConnectedToCourseFilter = isConnectedToCourseFilter;
            try {
                //! TODO add integration in the UI with courses - two views one for events connected to course and for for normal events
                const result = await EventsService.eventGantt(currentUser.baseId!, rest);
                setResources(
                    result.map(({ name: title, startDate, endDate, description, courseName, _id: id }): Task => {
                        const start = new Date(startDate);
                        const end = new Date(endDate);

                        return {
                            id,
                            title,
                            start,
                            end,
                            subTitle: courseName?.length ? `${courseName} - ${description}` : description,
                            status: getCourseStatus(end, start),
                            type: 'bar',
                        };
                    }),
                );
            } catch (_error) {
                toast.error(i18next.t('eventsGantt.getError'));
            }
        };
        if (filter.startDate && filter.endDate) getEvents();
    }, [filter, currentUser.baseId!]);
    return (
        <Grid container direction="column" spacing={2} sx={{ width: '100%', ml: !miniGanttFlag ? '2.5%' : '' }}>
            {openModal && <EventDetails open={openModal} handleClose={handleClose} event={selectedEvent} />}
            {!miniGanttFlag ? (
                <Grid item>
                    <Sorts filter={filter} setFilter={setFilter} pageType={PageType.EVENT} />
                </Grid>
            ) : (
                <Grid item container direction="row" alignItems="center">
                    <Grid item>
                        <Sorts filter={filter} setFilter={setFilter} pageType={PageType.EVENT} />
                    </Grid>
                    <Grid item sx={{ width: '30%' }}>
                        <Legend
                            items={[
                                { dotColor: colors.done, text: `${i18next.t('EventsGanttLegends.done')}` },
                                { dotColor: colors.active, text: `${i18next.t('EventsGanttLegends.active')}` },
                                { dotColor: colors.future, text: `${i18next.t('EventsGanttLegends.future')}` },
                            ]}
                            sx={{ gap: '1px' }}
                            spacing="space-between"
                        />
                    </Grid>
                </Grid>
            )}
            <Grid item sx={{ width: '100%' }}>
                <Gantt
                    tasks={[resources]}
                    columnWidth={getColumnWidth(view)}
                    editMode={false}
                    listCellWidth=""
                    onSelect={handleSelect}
                    openModal={openModal}
                    viewMode={view}
                    ganttStartDate={filter.startDate}
                    filter={filter}
                />
            </Grid>
            {!miniGanttFlag && (
                <Grid item>
                    <Legend
                        items={[
                            { dotColor: colors.done, text: `${i18next.t('EventsGanttLegends.done')}` },
                            { dotColor: colors.active, text: `${i18next.t('EventsGanttLegends.active')}` },
                            { dotColor: colors.future, text: `${i18next.t('EventsGanttLegends.future')}` },
                        ]}
                        sx={{ display: 'flex', gap: '2rem', justifyContent: 'inherit', mt: '1rem' }}
                        spacing="space-between"
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default EventsGantt;
