import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { BaseDocument } from '../../interfaces/base';
import { CourseTemplate, CourseTemplateDocument, Types } from '../../interfaces/courseTemplate';
import { NetworkDocument } from '../../interfaces/network';
import { axios } from '../../utils/axios';
import { maybe } from '../../utils/faker';
import { getBranches } from '../resources/bases';

const { uri, courseTemplatesRoute } = config.courses;

const courseTemplatesNames = ['יסודות', 'אתרוג', 'קפ"ה', 'אר"מ', 'אפולו', 'אע"מ', 'ב"מ', 'תוכניתנים', 'דבאופס'];

export const getCourseTemplates = async () => {
    const { data } = await axios.get<CourseTemplateDocument[]>(uri + courseTemplatesRoute, { params: config.getManyParams });
    return data;
};

const createCourseTemplate = async (courseTemplate: CourseTemplate) => {
    const { data } = await axios.post<CourseTemplateDocument>(uri + courseTemplatesRoute, courseTemplate);
    return data;
};

export const createCourseTemplates = (bases: BaseDocument[], networks: NetworkDocument[]) => {
    const networkIds = networks.map(({ _id }) => _id);

    return Promise.all(
        courseTemplatesNames.map(async (name) => {
            const baseId = faker.helpers.arrayElement(bases)._id;

            return createCourseTemplate({
                baseId,
                branchId: faker.helpers.arrayElement(await getBranches(baseId))._id,
                networks: faker.helpers.arrayElements(networkIds),
                name,
                type: faker.helpers.arrayElement(Object.values(Types)),
                courseACAId: faker.random.numeric(8),
                unit: faker.random.numeric(4),
                staffRatio: faker.datatype.number({ min: 2, max: 7 }),
                courseSAPId: maybe(faker.random.numeric(5)),
                profession: maybe(faker.random.numeric(4)),
            });
        }),
    );
};
