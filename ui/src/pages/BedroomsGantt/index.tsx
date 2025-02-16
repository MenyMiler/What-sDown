/* eslint-disable react/require-default-props */
/* eslint-disable indent */
import { Grid, IconButton } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/no-unresolved
import InfoIcon from '@mui/icons-material/Info';
import Sorts, { PageType } from '../../common/filterSelect';
import { Task, ViewMode } from '../../common/ganttTask';
import { Gantt } from '../../common/ganttTask/components/gantt/gantt';
import { BedroomGantt, SubDatesBedroomGanttData } from '../../interfaces/roomInCourse';
import { BasesService } from '../../services/bases';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';
import { getColumnWidth } from '../../utils/gantt';
import { initTasks, initTasksItems } from './helper';
import { areDatesEqual } from '../../utils/datePickers';
import BedroomCubeInfo from './BedroomCubeInfo';

const DATE_DIFF = 1000 * 60 * 60 * 24; // One day in milliseconds

interface BedroomsGanttProps {
    miniGanttFlag?: boolean;
}

const BedroomsGantt = ({ miniGanttFlag = false }: BedroomsGanttProps) => {
    const [view, setView] = React.useState<ViewMode>(ViewMode.TwoWeek);
    const [resources, setResources] = React.useState<Task[][]>(initTasks());
    const [isChecked, _setIsChecked] = React.useState(true);
    const currentUser = useUserStore(({ user }) => user);
    const [filter, setFilter] = React.useState<any>({});
    const [resourcesItems, setResourcesItems] = React.useState<Task[]>(initTasksItems());
    const [bedrooms, setBedrooms] = React.useState<{ name: string; _id: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [coursesIds, setCourseIds] = useState<string[]>([]);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);

    const initFilters = () => {
        setFilter(({ startDate, endDate, soldierId }: any) => ({
            startDate,
            endDate,
            soldierId,
        }));
        setView(ViewMode.TwoWeek);
    };

    const returnResource = (bedroom: BedroomGantt, date?: SubDatesBedroomGanttData) => {
        if (date) {
            const start = new Date(`${date.startDate}`);
            const end = new Date(`${date.endDate}`);
            let opacity = date.occupation / bedroom.maxCapacity;
            if (opacity <= 0) opacity = 0.1;

            return {
                bedroomId: bedroom._id,
                start,
                end,
                title: bedroom.name,
                subTitle: `(${date.soldiersOccupation}) ${date.occupation > bedroom.maxCapacity ? bedroom.maxCapacity : date.occupation}/${
                    bedroom.maxCapacity
                }`,
                soldiersOccupation: date.soldiersOccupation,
                occupation: date.occupation,
                maxCapacity: bedroom.maxCapacity,
                location: `${bedroom.location.floorNumber}, ${bedroom.location.buildingName}`,
                building: `${bedroom.location.buildingName}`,
                floor: `${bedroom.location.floorNumber}`,
                id: bedroom._id + date.startDate,
                type: 'square',
                styles: { opacity },
            };
        }
        return {
            title: bedroom.name,
            id: bedroom._id,
            location: `${bedroom.location.floorNumber}, ${bedroom.location.buildingName}`,
            building: `${bedroom.location.buildingName}`,
            floor: `${bedroom.location.floorNumber}`,
            type: 'square',
        };
    };

    const [extendedTasks, setExtendedTasks] = useState(resources);

    const createCopiesWithDateDifference = (obj: Task, startDate: Date, endDate: Date, existingCopies: Task[]): Task[] => {
        const copies: Task[] = [];

        let currentDate = new Date(startDate);

        while (currentDate < endDate && !areDatesEqual(currentDate, endDate)) {
            const copy: Task = {
                ...obj,
                start: new Date(currentDate),
                end: new Date(currentDate.getTime() + DATE_DIFF),
            };

            const hasDuplicate = existingCopies.find(
                (existingCopy) => areDatesEqual(existingCopy.start, copy.start) || areDatesEqual(existingCopy.end, copy.end),
            )!;

            if (!hasDuplicate) copies.push(copy);
            else {
                hasDuplicate.occupation! += copy.occupation!;
                hasDuplicate.soldiersOccupation! += copy.soldiersOccupation!;
                hasDuplicate.subTitle = `(${hasDuplicate.soldiersOccupation}) ${
                    hasDuplicate.occupation! > hasDuplicate.maxCapacity! ? hasDuplicate.maxCapacity : hasDuplicate.occupation
                }/${hasDuplicate.maxCapacity}`;
                let opacity: any = hasDuplicate.occupation! / hasDuplicate.maxCapacity!;
                if (opacity <= 0) opacity = 0.1;
                hasDuplicate.styles = { opacity };
            }

            currentDate = new Date(currentDate.getTime() + DATE_DIFF);
        }

        return copies;
    };

    const findDateRangeOverlap = (obj: Task, obj2: any) => {
        const overlapStart = obj.start > obj2.startDate ? obj.start : obj2.startDate;
        const overlapEnd = obj.end < obj2.endDate ? obj.end : obj2.endDate;

        return overlapStart <= overlapEnd
            ? {
                  start: overlapStart,
                  end: overlapEnd,
              }
            : { start: '', end: '' };
    };

    const filterAndCopyArray = (arr: Task[][]): Task[][] => {
        const filteredAndCopied: Task[][] = [];

        arr.forEach((element) => {
            const innerArr = element.sort((a, b) => a.start.getTime() - b.start.getTime());

            const copiedInnerArr: Task[] = [];

            innerArr.forEach((innerElement) => {
                const obj = innerElement;

                const { start, end } = findDateRangeOverlap(obj, filter);

                if (!start || !end) return;

                const subTasks = createCopiesWithDateDifference(obj, new Date(start), new Date(new Date(end.getTime() + DATE_DIFF)), copiedInnerArr);

                subTasks.forEach((subTask: any) => {
                    copiedInnerArr.push(subTask);
                });
            });

            if (copiedInnerArr.length > 0) filteredAndCopied.push(copiedInnerArr);
        });

        return filteredAndCopied;
    };

    useEffect(() => {
        const getResources = async () => {
            try {
                const gantt = await BasesService.bedroomGantt(currentUser.baseId!, filter);
                setResources([]);
                setResourcesItems([]);
                setIsLoading(false);

                if (!gantt.length) return;

                setResources(gantt.map((bedroom) => bedroom.dates.map((date) => returnResource(bedroom, date))) as any);

                setResourcesItems(gantt.map(returnResource as any));
                setBedrooms(
                    gantt.flatMap(({ name, _id }) => ({
                        _id,
                        name,
                    })),
                );
            } catch (error) {
                toast.error(i18next.t('ganttError'));
            }
        };
        const getCourseIds = async () => {
            try {
                const { startDate, endDate } = filter;
                const courses = await CoursesService.getByQuery({ startDate, endDate, populate: false });

                setCourseIds(courses.map(({ _id }) => _id));
            } catch (error) {
                toast.error(i18next.t('ganttError'));
            }
        };
        if (filter.startDate && filter.endDate) {
            filter.endDate = new Date(filter.startDate.getTime() + 13 * 24 * 60 * 60 * 1000);
            getResources();
            getCourseIds();
        }
    }, [filter, currentUser.baseId!]);

    useEffect(() => {
        setExtendedTasks([]);
        if (resources.length && resources[0][0]?.bedroomId) setExtendedTasks(filterAndCopyArray(resources));
    }, [resources]);

    return (
        <Grid container direction="column" spacing={2} sx={{ width: !miniGanttFlag ? '95%' : '100%', ml: !miniGanttFlag ? '2.5%' : '' }}>
            <Grid item container justifyContent="space-between" alignItems="baseline">
                <Grid item>
                    <Sorts
                        filter={filter}
                        setFilter={setFilter}
                        pageType={PageType.BEDROOM}
                        bedrooms={bedrooms}
                        coursesIds={coursesIds}
                        initFilters={initFilters}
                    />
                </Grid>

                <Grid item>
                    <IconButton onClick={() => setInfoOpen(true)}>
                        <InfoIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Grid item sx={{ width: '100%' }}>
                <Gantt
                    tasks={extendedTasks}
                    viewMode={view}
                    listCellWidth={isChecked ? '100' : ''}
                    columnWidth={getColumnWidth(view) - 15}
                    editMode={false}
                    title={i18next.t('ganttTitles.rooms')}
                    resourcesItems={resourcesItems}
                    ganttStartDate={filter.startDate}
                    ganttEndDate={filter.endDate}
                    barFill={100}
                    filter={filter}
                    ganttType="bedroom"
                    tasksLength={resources.length}
                />
            </Grid>
            <BedroomCubeInfo open={infoOpen} handleClose={() => setInfoOpen(false)} />
        </Grid>
    );
};

export default BedroomsGantt;
