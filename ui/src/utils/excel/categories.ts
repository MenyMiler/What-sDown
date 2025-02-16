export const i18TranslateCategories = {
    i18TranslateStudentCategories: 'studentCategories',
    i18TranslateAnnualGraphCategories: 'annualGraphCategories',
    i18TranslateBuildingsCategories: 'buildingsCategories',
    i18TranslateAreasCategories: 'areasCategories',
    i18TranslateFloorsCategories: 'floorsCategories',
    i18TranslateRoomsCategories: 'roomsCategories',
};

export type Categories = string[];

export const studentCategories: Categories = ['name', 'personalNumber', 'gender', 'studentType', 'exceptional'];

// TODO change here as well
export const annualGraphCategories: Categories = [
    'courseId',
    'year',
    'courseType',
    'branch',
    'courseLocation',
    'unit',
    'courseSAPId',
    'profession',
    'courseName',
    'RAKAZCourseDuration',
    'actualCourseDuration',
    'basicTrainingStartDate',
    'basicTrainingEndDate',
    'receivanceDate',
    'startDate',
    'endDate',
    'enlistmentDate',
    'network',
    'iturMale',
    'iturFemale',
    'specialMale',
    'specialFemale',
    'totalMale',
    'totalFemale',
];
