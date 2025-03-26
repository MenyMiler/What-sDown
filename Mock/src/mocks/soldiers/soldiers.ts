import { faker } from '@faker-js/faker/locale/he';
import { config } from '../../config';
import { Genders, Soldier, SoldierDocument, SoldierTypes, StudentTypes } from '../../interfaces/soldier';
import { axios } from '../../utils/axios';

const { uri, baseRoute, numberOfStaff, numberOfStudents } = config.soldiers;

export const getSoldiers = async () => {
    const { data } = await axios.get<SoldierDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const generateSoldier = (soldierType: SoldierTypes) => {
    const gender = faker.helpers.arrayElement(Object.values(Genders));
    let sex: NonNullable<Parameters<typeof faker.name.fullName>[0]>['sex'];

    if (gender === Genders.OTHER_FEMALE || gender === Genders.FEMALE) sex = 'female';
    else if (gender === Genders.OTHER_MALE || gender === Genders.MALE) sex = 'male';

    return {
        name: faker.name.fullName({ sex }),
        personalNumber: faker.random.numeric(7),
        gender,
        soldierType,
        studentType: soldierType === SoldierTypes.STUDENT ? faker.helpers.arrayElement(Object.values(StudentTypes)) : StudentTypes.REGULAR,
        exceptional: faker.datatype.boolean(),
    };
};

const createSoldier = async (soldier: Soldier) => {
    const { data } = await axios.post<SoldierDocument>(uri + baseRoute, soldier);
    return data;
};

export const createSoldiers = () => {
    return Promise.all([
        ...Array.from({ length: numberOfStaff }, () => createSoldier(generateSoldier(SoldierTypes.STAFF))),
        ...Array.from({ length: numberOfStudents }, () => createSoldier(generateSoldier(SoldierTypes.STUDENT))),
    ]);
};
