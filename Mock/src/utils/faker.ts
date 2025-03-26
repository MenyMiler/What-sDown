import { faker } from '@faker-js/faker/locale/he';

export const maybe = <T>(value: T, probability?: number) => faker.helpers.maybe(() => value, { probability });
