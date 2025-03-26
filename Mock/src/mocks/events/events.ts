import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { BaseDocument } from '../../interfaces/base';
import { CourseDocument } from '../../interfaces/course';
import { Event, EventDocument } from '../../interfaces/event';
import { axios } from '../../utils/axios';

const { uri, baseRoute, numberOfEvents, numberOfEventsRelatedToCourse, beforeDate, afterDate } = config.events;
const daysBetweenDates = 90;

export const getEvents = async () => {
    const { data } = await axios.get<EventDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const generateEventRelatedToCourse = (bases: BaseDocument[], courses: CourseDocument[]): Event => {
    const { _id: courseId, name, startDate, endDate } = faker.helpers.arrayElement(courses);

    const beforeCourseDate = new Date(startDate);
    beforeCourseDate.setDate(beforeCourseDate.getDate() - beforeDate);

    const afterCourseDate = new Date(endDate);
    afterCourseDate.setDate(afterCourseDate.getDate() + afterDate);

    return {
        baseId: faker.helpers.arrayElement(bases)._id,
        courseId,
        name: `הכנת סגל לקורס ${name}`,
        description: 'הכנת סגל',
        amount: faker.datatype.number(10),
        startDate: beforeCourseDate,
        endDate: afterCourseDate,
    };
};

const generateEvent = (bases: BaseDocument[]): Event => {
    const [startDate, endDate] = faker.date.betweens(faker.date.recent(daysBetweenDates), faker.date.soon(daysBetweenDates + 2), 2);

    return {
        baseId: faker.helpers.arrayElement(bases)._id,
        name: `event number ${faker.random.numeric(4)}`,
        description: 'event',
        amount: faker.datatype.number(10),
        startDate,
        endDate,
    };
};

const createEvent = async (event: Event) => {
    const { data } = await axios.post<EventDocument>(uri + baseRoute, event);
    return data;
};

export const createEvents = (bases: BaseDocument[], courses: CourseDocument[]) => {
    return Promise.all([
        ...Array.from({ length: numberOfEvents }, () => createEvent(generateEvent(bases))),
        ...Array.from({ length: numberOfEventsRelatedToCourse }, () => createEvent(generateEventRelatedToCourse(bases, courses))),
    ]);
};
