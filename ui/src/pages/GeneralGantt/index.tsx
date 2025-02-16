/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import { CellTower } from '@mui/icons-material';
import { Box, Grid, Tooltip } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect } from 'react';
import Legend from '../../common/Legend';
import Sorts, { PageType } from '../../common/filterSelect';
import { Task, ViewMode } from '../../common/ganttTask';
import { Gantt } from '../../common/ganttTask/components/gantt/gantt';
import { environment } from '../../globals';
import { ClassOrOfficeGantt, SubDatesClassOrOfficeGanttData } from '../../interfaces/roomInCourse';
import { BasesService } from '../../services/bases';
import { useUserStore } from '../../stores/user';
import { getColumnWidth } from '../../utils/gantt';
import { initTasks, initTasksItems } from './helper';
import { Status } from '../../common/ganttTask/types/public-types';

interface generalProps {
    type: PageType.OFFICE | PageType.CLASS;
    miniGanttFlag?: boolean;
}

const GeneralGantt = ({ type, miniGanttFlag = false }: generalProps) => {
    const [view, setView] = React.useState<ViewMode>(ViewMode.Week);
    const [resources, setResources] = React.useState<Task[][]>(initTasks());
    const [isChecked, _setIsChecked] = React.useState(false);
    const currentUser = useUserStore(({ user }) => user);
    const [filter, setFilter] = React.useState<any>({ networks: {}, viewMode: ViewMode.Week });
    const [resourcesItems, setResourcesItems] = React.useState<Task[]>(initTasksItems());
    const [facilities, setFacilities] = React.useState<{ name: string; _id: string }[]>([]);
    const colors = environment.colors.resourceState;

    const initFilters = () => {
        setFilter(({ startDate, endDate }: any) => ({
            startDate,
            endDate,
            networks: {},
            viewMode: ViewMode.Week,
        }));
        setView(ViewMode.Week);
    };

    const getCourseStatus = (start: Date, end: Date) => {
        const today = new Date();
        if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) return Status.Active;
        if (today.getTime() > start.getTime()) return Status.Done;
        return Status.Future;
    };

    const returnResource = (facility: ClassOrOfficeGantt, date?: SubDatesClassOrOfficeGanttData) => {
        if (date) {
            const start = new Date(`${date.startDate}`);
            const end = new Date(`${date.endDate}`);
            return {
                start: new Date(facility.customStart ?? facility.startDate ?? start),
                end: new Date(facility.customEnd ?? facility.endDate ?? end),
                title: facility.name,
                id: facility._id,
                type: 'bar',
                status: getCourseStatus(start, end),
                color: date.occupation === 0 ? colors.empty : date.occupation !== facility.maxCapacity ? colors.occupied : colors.full,
                gantt: 'general',
                subTitle: date.courseOrEventName,
            };
        }
        return {
            title: facility.name,
            id: facility.name,
            child: facility.networks.length ? (
                <Tooltip title={facility.networks.join(', ')}>
                    <CellTower fontSize="small" sx={{ color: 'grey' }} />
                </Tooltip>
            ) : (
                <Tooltip title={i18next.t('feedbackManagementPage.none')}>
                    <CellTower fontSize="small" sx={{ color: 'grey' }} />
                </Tooltip>
            ),
            branch: facility.branch,
            type: 'bar',
        };
    };

    useEffect(() => initFilters(), [type]);

    useEffect(() => {
        const { startDate, endDate } = filter;
        async function getResources() {
            setView(filter.viewMode);
            const gantt = await BasesService.classOrOfficeGantt(currentUser.baseId!, { ...filter, type });
            setResourcesItems([]);
            setResources([]);
            if (!gantt.length) return;
            setResources(gantt.map((facility) => facility.dates.map((date) => returnResource(facility, date))) as any);
            setResourcesItems(gantt.map(returnResource as any));
            setFacilities([
                ...new Map(
                    gantt
                        .flatMap(({ name, _id }) => ({ _id, name }))
                        .sort(({ name: firstName }, { name: secondName }) => firstName.localeCompare(secondName))
                        .map((item) => [item._id, item]),
                ).values(),
            ]);
        }
        if (startDate && endDate) getResources();
    }, [filter, type, currentUser.baseId!]);

    return (
        <Grid container direction="column" spacing={2} sx={{ width: '100%', ml: !miniGanttFlag ? '2.5%' : '' }}>
            {!miniGanttFlag ? (
                <Grid item>
                    <Sorts setFilter={setFilter} facilities={facilities} initFilters={initFilters} filter={filter} pageType={PageType.FACILITIES} />
                </Grid>
            ) : (
                <Grid item container direction="row" alignItems="center" gap={2}>
                    <Grid item>
                        <Sorts
                            setFilter={setFilter}
                            facilities={facilities}
                            initFilters={initFilters}
                            filter={filter}
                            pageType={PageType.FACILITIES}
                        />
                    </Grid>
                    <Grid item sx={{ width: '50%' }}>
                        <Legend
                            items={[
                                { dotColor: `${colors.full}`, text: `${i18next.t('resourceManagement.resourceStateColors.full')}` },
                                { dotColor: `${colors.occupied}`, text: `${i18next.t('resourceManagement.resourceStateColors.occupied')}` },
                                { dotColor: `${colors.empty}`, text: `${i18next.t('resourceManagement.resourceStateColors.empty')}` },
                            ]}
                            spacing="space-evenly"
                        />
                    </Grid>
                </Grid>
            )}
            <Grid item sx={{ width: '100%' }}>
                <Gantt
                    tasks={[resources.flat()]}
                    viewMode={view}
                    listCellWidth={isChecked ? '40' : ''}
                    columnWidth={getColumnWidth(view)}
                    editMode={false}
                    title={type === PageType.CLASS ? i18next.t('ganttTitles.classes') : i18next.t('ganttTitles.offices')}
                    resourcesItems={resourcesItems}
                    ganttStartDate={filter.startDate}
                    filter={filter}
                />
            </Grid>
            {!miniGanttFlag && (
                <Grid item>
                    <Legend
                        items={[
                            { dotColor: `${colors.full}`, text: `${i18next.t('resourceManagement.resourceStateColors.full')}` },
                            { dotColor: `${colors.occupied}`, text: `${i18next.t('resourceManagement.resourceStateColors.occupied')}` },
                            { dotColor: `${colors.empty}`, text: `${i18next.t('resourceManagement.resourceStateColors.empty')}` },
                        ]}
                        sx={{ display: 'flex', gap: '2rem', justifyContent: 'inherit', mt: '1rem' }}
                        spacing="space-between"
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default GeneralGantt;
