import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { Course, CourseDocument, SoldierAmounts } from '../../interfaces/course';
import { CourseTemplateDocument, Types } from '../../interfaces/courseTemplate';
import { NetworkDocument } from '../../interfaces/network';
import { AllGenders } from '../../interfaces/soldier';
import { UserTypes } from '../../interfaces/user';
import { axios } from '../../utils/axios';
import { maybe } from '../../utils/faker';

const { uri, coursesRoute, numberOfCourses } = config.courses;

export const getCourses = async () => {
    const { data } = await axios.get<CourseDocument[]>(uri + coursesRoute, { params: config.getManyParams });
    return data;
};

const createCourse = async (course: Course) => {
    const { data } = await axios.post<CourseDocument>(uri + coursesRoute, course);
    return data;
};

const daysBetweenDates = 90;
const dayInMilliseconds = 24 * 60 * 60 * 1000;
const basicTrainingDurationInDays = 21;

const getDaysDifference = (startDate: Date, endDate: Date) => Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / dayInMilliseconds);

export const createCourses = async (courseTemplates: CourseTemplateDocument[], networks: NetworkDocument[]) => {
    const networkIds = networks.map(({ _id }) => _id);

    return Promise.all(
        Array.from({ length: numberOfCourses }, async () => {
            const { _id, ...courseTemplate } = faker.helpers.arrayElement(courseTemplates);

            const [startDate, endDate] = faker.date.betweens(faker.date.recent(daysBetweenDates), faker.date.soon(daysBetweenDates + 2), 2);
            endDate.setTime(endDate.getTime() + dayInMilliseconds);

            let bootCamp: Course['bootCamp'] = {};
            const bootCampEndDate = maybe(startDate);

            if (bootCampEndDate) {
                bootCampEndDate.setTime(bootCampEndDate.getTime() - dayInMilliseconds);

                const bootCampStartDate = new Date();
                bootCampStartDate.setTime(bootCampEndDate.getTime() - basicTrainingDurationInDays * dayInMilliseconds);

                bootCamp = {
                    startDate: bootCampStartDate,
                    endDate: bootCampEndDate,
                };
            }

            return createCourse({
                ...courseTemplate,
                userType: faker.helpers.arrayElement(Object.values(UserTypes)),
                startDate,
                endDate,
                bootCamp,
                enlistmentDate: courseTemplate.type === Types.PRE_ENLISTMENT ? faker.date.past(1, bootCamp.startDate) : undefined,
                year: startDate.getFullYear(),
                durations: {
                    rakaz: getDaysDifference(startDate, endDate) + faker.datatype.number({ min: 1, max: 4 }),
                    actual: getDaysDifference(startDate, endDate) + 1,
                },
                receivanceDate: maybe(new Date(startDate.getTime() - dayInMilliseconds)),
                networks: faker.helpers.arrayElements(networkIds),
                soldierAmounts: Object.fromEntries(AllGenders.map((gender) => [gender, faker.datatype.number({ max: 4 })])) as SoldierAmounts,
            });
        }),
    );
};
