/* eslint-disable import/no-unresolved */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import { useMemo } from 'react';
import { Task } from '../ganttTask/types/public-types';
import BedroomsFilter from './filtersPerType/bedrooms';
import CoursesFilter from './filtersPerType/courses';
import EventsFilter from './filtersPerType/events';
import FacilitiesFilter from './filtersPerType/facilities';
import RecruitFilter from './filtersPerType/recruit';

interface sortContainerProps {
    setFilter: (filterBy: any) => any;
    initFilters?: () => any;
    filter: any;
    pageType: PageType;
    facilities?: { name: string; _id: string }[];
    bedrooms?: { name: string; _id: string }[];
    setChangedTasks?: React.Dispatch<React.SetStateAction<Map<string, Task>>>;
    coursesIds?: string[];
}

export enum PageType {
    CLASS = 'CLASS',
    OFFICE = 'OFFICE',
    COURSE = 'courses',
    BEDROOM = 'BEDROOM',
    RECRUIT = 'recruit',
    EVENT = 'event',
    FACILITIES = 'facilities',
}

const Sorts = (props: sortContainerProps) => {
    const { pageType, setFilter, bedrooms, filter, initFilters, coursesIds, facilities, setChangedTasks } = props;

    const sort = useMemo(() => {
        switch (pageType) {
            case PageType.BEDROOM:
                return (
                    <BedroomsFilter filter={filter} setFilter={setFilter} bedrooms={bedrooms!} initFilters={initFilters!} coursesIds={coursesIds!} />
                );

            case PageType.FACILITIES:
                return <FacilitiesFilter setFilter={setFilter} initFilters={initFilters!} facilities={facilities!} filter={filter} />;

            case PageType.COURSE:
                return <CoursesFilter setFilter={setFilter} initFilters={initFilters!} filter={filter} setChangedTasks={setChangedTasks!} />;
            case PageType.RECRUIT:
                return <RecruitFilter setFilter={setFilter} filter={filter} />;

            case PageType.EVENT:
                return <EventsFilter filter={filter} setFilter={setFilter} />;

            default:
                return null;
        }
    }, [pageType, filter, coursesIds, facilities]);

    return sort;
};

export default Sorts;
