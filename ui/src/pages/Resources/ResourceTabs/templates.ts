import i18next from 'i18next';
import * as yup from 'yup';
import { Types as CourseTypes } from '../../../interfaces/courseTemplate';
import { RoomTypes } from '../../../interfaces/room';
import { AllGenders, Genders, SoldierTypes, SpecialStudentTypes } from '../../../interfaces/soldier';
import { Types as UserTypes } from '../../../interfaces/user';
import { AreasService } from '../../../services/areas';
import { BasesService } from '../../../services/bases';
import { BranchesService } from '../../../services/branches';
import { BuildingsService } from '../../../services/buildings';
import { CoursesService } from '../../../services/courses';
import { FloorsService } from '../../../services/floors';
import { KartoffelService } from '../../../services/kartoffel';
import { NetworksService } from '../../../services/networks';
import { convertDateTolocaleString } from '../../../utils/today';
import { date, greaterThanDate, minMax, optionalNumber, requiredArray, requiredString, yupRequire } from '../../../utils/yup';
import { Field } from './Field';
import { BooleanField, DateField, NumberField, ObjectField, ReferenceField, StringField, TranslatedEnumField } from './Fields';
import { RelatedFieldsWrapper } from './RelatedFieldsWrapper';
import { Resource } from '.';

export type Template = (Field | RelatedFieldsWrapper)[];

export const getSchema = (template: Template): Record<string, any> =>
    template.reduce(
        (acc, field) =>
            field instanceof Field ? { ...acc, [field.getName()]: field.getOptions().validation } : { ...acc, ...getSchema(field.getFields()) },
        {},
    );

export const getFieldFromTemplate = (template: Template, fieldName: string): Field | undefined => {
    for (let index = 0; index < template.length; index++) {
        const field = template[index];

        if (field instanceof RelatedFieldsWrapper) {
            const currentField = field.getFields().find((f) => f.getName() === fieldName);
            if (currentField) return currentField;
        } else if (field.getName() === fieldName) {
            return field;
        }
    }
    return undefined;
};

export const courseTemplateTemplate: Template = [
    new StringField('name', { validation: requiredString }),
    new RelatedFieldsWrapper([
        {
            field: new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.base'),
                getAll: true,
                populatedFieldName: 'base',
            }),
            onChange: (value, relatedFields, formContext) =>
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'baseId',
                    'branchId',
                    RelatedFieldsWrapper.populateQueryWithValues({ baseId: 'id' }, value),
                ),
        },
        {
            field: new ReferenceField(
                'branchId',
                BranchesService.getById,
                ({ baseId }) => (baseId ? BasesService.getBranches(baseId) : Promise.resolve([])),
                'name',
                {
                    validation: requiredString,
                    label: i18next.t('common.branch'),
                    getAll: true,
                    populatedFieldName: 'branch',
                    disableFilter: true,
                },
            ),
        },
    ]),
    new TranslatedEnumField('type', CourseTypes, 'common.types', { validation: requiredString }),
    new ReferenceField('networks', NetworksService.getById, NetworksService.getByQuery, 'name', {
        validation: requiredArray,
        label: i18next.t('common.networks'),
        getAll: true,
        populatedFieldName: 'networks',
        multiple: true,
        disableFilter: true,
    }),
    new StringField('courseACAId', { validation: requiredString }),
    new StringField('courseSAPId'),
    new StringField('unit'),
    new NumberField('staffRatio', { validation: optionalNumber }),
    new StringField('profession'),
];

const courseTemplateTemplateWithoutType = [...courseTemplateTemplate];

courseTemplateTemplateWithoutType.splice(
    courseTemplateTemplateWithoutType.findIndex((field) => (field instanceof Field ? field.getName() === 'type' : false)),
    1,
);

export const courseTemplate: Template = [
    ...courseTemplateTemplateWithoutType,
    new DateField('startDate', { validation: yupRequire(date) }),
    new DateField('endDate', { validation: yupRequire(greaterThanDate('startDate')) }),
    new NumberField('year', { validation: optionalNumber }),
    new RelatedFieldsWrapper([
        {
            field: new TranslatedEnumField('type', CourseTypes, 'common.types', { validation: requiredString }),
            onChange: (value, relatedFields, formContext) => {
                const { field: enlistmentDateField } = relatedFields.enlistmentDate;

                if (!enlistmentDateField) return;

                enlistmentDateField.setOptions({ disabled: value !== CourseTypes.PRE_ENLISTMENT });
                if (value !== CourseTypes.PRE_ENLISTMENT) formContext.setValue(enlistmentDateField.getName(), undefined);
            },
        },
        {
            field: new DateField('enlistmentDate', {
                validation: date.when('type', { is: CourseTypes.PRE_ENLISTMENT, then: yupRequire }),
                disabled: true,
            }),
        },
    ]),
    new ObjectField('bootCamp', [
        new DateField('startDate', { validation: date }),
        new DateField('endDate', { validation: greaterThanDate('startDate') }),
    ]),
    new ObjectField('durations', [
        new NumberField('rakaz', { validation: optionalNumber }),
        new NumberField('actual', { validation: optionalNumber }),
    ]),
    new DateField('receivanceDate', { validation: date }),
    new TranslatedEnumField('userType', UserTypes, 'userTypes', { validation: requiredString, label: i18next.t('common.requestedUserType') }),
    new ObjectField(
        'soldierAmounts',
        AllGenders.map((gender) => new NumberField(gender, { validation: optionalNumber })),
    ),
];

export const baseTemplate: Template = [
    new StringField('name', { validation: requiredString }),
    new NumberField('buffer', { validation: minMax(1) }),
    new NumberField('maxCapacity', { validation: minMax(1) }),
    new ReferenceField('branches', BranchesService.getById, BranchesService.getByQuery, 'name', {
        validation: requiredArray,
        label: i18next.t('common.branches'),
        getAll: true,
        populatedFieldName: 'branches',
        multiple: true,
    }),
];

export const areaTemplate: Template = [
    new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
        validation: requiredString,
        label: i18next.t('common.base'),
        getAll: true,
        populatedFieldName: 'base',
    }),
    new StringField('name', { validation: requiredString }),
];

export const buildingTemplate: Template = [
    new RelatedFieldsWrapper([
        {
            field: new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.base'),
                getAll: true,
                populatedFieldName: 'base',
                disableFilter: true,
                shouldDisplayOnUpdate: false,
            }),
            onChange: (value, relatedFields, formContext) =>
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'baseId',
                    'areaId',
                    RelatedFieldsWrapper.populateQueryWithValues({ baseId: 'id' }, value),
                ),
        },
        {
            field: new ReferenceField('areaId', (id) => AreasService.getById(id, false), AreasService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.area'),
                getAll: true,
                populatedFieldName: 'area',
            }),
            onChange: (value, relatedFields, formContext) =>
                RelatedFieldsWrapper.setReferenceFieldValueOnOpen(value, relatedFields, formContext, 'baseId', 'baseId'),
        },
    ]),
    new StringField('name', { validation: requiredString }),
    new BooleanField('isStaff'),
];

export const floorTemplate: Template = [
    new RelatedFieldsWrapper([
        {
            field: new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.base'),
                getAll: true,
                populatedFieldName: 'base',
                disableFilter: true,
                shouldDisplayOnUpdate: false,
            }),
            onChange: (value, relatedFields, formContext) => {
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'baseId',
                    'areaId',
                    RelatedFieldsWrapper.populateQueryWithValues({ baseId: 'id' }, value),
                );

                RelatedFieldsWrapper.setReferenceFieldValueOnChange(value, relatedFields, formContext, 'baseId', 'buildingId');
            },
        },
        {
            field: new ReferenceField('areaId', (id) => AreasService.getById(id, false), AreasService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.area'),
                getAll: true,
                populatedFieldName: 'area',
                disableFilter: true,
                shouldDisplayOnUpdate: false,
            }),
            onChange: (value, relatedFields, formContext) => {
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'areaId',
                    'buildingId',
                    RelatedFieldsWrapper.populateQueryWithValues({ areaId: 'id' }, value),
                );
            },
        },
        {
            field: new ReferenceField('buildingId', BuildingsService.getById, BuildingsService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.building'),
                getAll: true,
                populatedFieldName: 'building',
            }),
            onChange: (value, relatedFields, formContext) =>
                RelatedFieldsWrapper.setReferenceFieldValueOnOpen(value, relatedFields, formContext, 'buildingId', 'buildingId'),
        },
    ]),
    new NumberField('floorNumber', { validation: minMax() }),
    new TranslatedEnumField('type', CourseTypes, 'common.types', { validation: requiredString }),
];

export const roomTemplate: Template = [
    new RelatedFieldsWrapper([
        {
            field: new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.base'),
                getAll: true,
                populatedFieldName: 'base',
                disableFilter: true,
                shouldDisplayOnUpdate: false,
            }),
            onChange: (value, relatedFields, formContext) => {
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'baseId',
                    'areaId',
                    RelatedFieldsWrapper.populateQueryWithValues({ baseId: 'id' }, value),
                );

                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'baseId',
                    'branchId',
                    RelatedFieldsWrapper.populateQueryWithValues({ baseId: 'id' }, value),
                );

                RelatedFieldsWrapper.setReferenceFieldValueOnChange(value, relatedFields, formContext, 'baseId', 'buildingId');
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(value, relatedFields, formContext, 'baseId', 'floorId');
            },
        },
        {
            field: new ReferenceField('areaId', (id) => AreasService.getById(id, false), AreasService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.area'),
                getAll: true,
                populatedFieldName: 'area',
                disableFilter: true,
                shouldDisplayOnUpdate: false,
            }),
            onChange: (value, relatedFields, formContext) => {
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'areaId',
                    'buildingId',
                    RelatedFieldsWrapper.populateQueryWithValues({ areaId: 'id' }, value),
                );

                RelatedFieldsWrapper.setReferenceFieldValueOnChange(value, relatedFields, formContext, 'baseId', 'floorId');
            },
        },
        {
            field: new ReferenceField('buildingId', BuildingsService.getById, BuildingsService.getByQuery, 'name', {
                validation: requiredString,
                label: i18next.t('common.building'),
                getAll: true,
                populatedFieldName: 'building',
                disableFilter: true,
                shouldDisplayOnUpdate: false,
            }),
            onChange: (value, relatedFields, formContext) =>
                RelatedFieldsWrapper.setReferenceFieldValueOnChange(
                    value,
                    relatedFields,
                    formContext,
                    'buildingId',
                    'floorId',
                    RelatedFieldsWrapper.populateQueryWithValues({ buildingId: 'id' }, value),
                ),
        },
        {
            field: new ReferenceField('floorId', FloorsService.getById, FloorsService.getByQuery, 'floorNumber', {
                validation: requiredString,
                label: i18next.t('common.floor'),
                getAll: true,
                populatedFieldName: 'floor',
                disableFilter: true,
            }),
        },
        {
            field: new ReferenceField(
                'branchId',
                BranchesService.getById,
                ({ baseId }) => (baseId ? BasesService.getBranches(baseId) : Promise.resolve([])),
                'name',
                {
                    validation: requiredString,
                    label: i18next.t('common.branch'),
                    getAll: true,
                    populatedFieldName: 'branch',
                    disableFilter: true,
                },
            ),
        },
    ]),
    new StringField('name', { validation: requiredString }),
    new RelatedFieldsWrapper([
        {
            field: new TranslatedEnumField('type', RoomTypes, 'common.roomTypes', {
                label: i18next.t('common.roomType'),
                validation: requiredString,
            }),
            onChange: (value, relatedFields, formContext) => {
                const {
                    gender: { field: genderField },
                    networks: { field: networksField },
                } = relatedFields;

                if (genderField) {
                    genderField.setOptions({ disabled: value !== RoomTypes.BEDROOM });
                    if (value !== RoomTypes.BEDROOM) formContext.setValue(genderField.getName(), undefined);
                }

                if (networksField) {
                    networksField.setOptions({ disabled: value === RoomTypes.BEDROOM });
                    if (value === RoomTypes.BEDROOM) formContext.setValue(networksField.getName(), []);
                }
            },
        },
        {
            field: new TranslatedEnumField('gender', Genders, 'common.genders', {
                validation: yup.string().when('type', { is: RoomTypes.BEDROOM, then: yupRequire }),
                disabled: true,
            }),
        },
        {
            field: new ReferenceField('networks', NetworksService.getById, NetworksService.getByQuery, 'name', {
                validation: yup.array(),
                label: i18next.t('common.networks'),
                getAll: true,
                populatedFieldName: 'networks',
                multiple: true,
                disableFilter: true,
                disabled: true,
                numberChipInput: true,
                transformValue: (value: Resource[]) => value.map(({ _id: networkId, amount }) => ({ networkId, amount: amount ?? 1 })),
            }),
        },
    ]),
    new NumberField('maxCapacity', { validation: minMax() }),
    new BooleanField('disabled'),
];

export const eventTemplate: Template = [
    new StringField('name', { validation: requiredString }),
    new StringField('description', { validation: requiredString }),
    new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
        validation: requiredString,
        label: i18next.t('common.base'),
        getAll: true,
        populatedFieldName: 'base',
    }),
    new ReferenceField('courseId', (id) => CoursesService.getById(id, false), CoursesService.getByQuery, 'name', {
        label: i18next.t('common.courseName'),
        getAutocompleteLabel: (course) =>
            `${course.name}  |  ${convertDateTolocaleString(course.endDate)} - ${convertDateTolocaleString(course.startDate)}`,
        populatedFieldName: 'course',
        disableFilter: true,
    }),
    new NumberField('amount', { validation: minMax(), label: i18next.t('common.participantsAmount') }),
    new DateField('startDate', { validation: yupRequire(date) }),
    new DateField('endDate', { validation: yupRequire(greaterThanDate('startDate')) }),
];

export const branchTemplate: Template = [new StringField('name', { validation: requiredString })];

export const networkTemplate: Template = [new StringField('name', { validation: requiredString })];

export const soldierTemplate: Template = [
    new StringField('name', { validation: requiredString }),
    new StringField('personalNumber', {
        validation: requiredString.length(7, i18next.t('yupErrorMsg.personalNumber')).matches(/^[0-9]+$/, i18next.t('yupErrorMsg.personalNumber')),
    }),
    new TranslatedEnumField('soldierType', SoldierTypes, 'common.soldierTypes', { validation: requiredString }),
    new TranslatedEnumField('gender', Genders, 'common.genders', { validation: requiredString }),
    new TranslatedEnumField('studentType', SpecialStudentTypes, 'common.studentTypes', { validation: requiredString }),
];

export const userTemplate: Template = [
    new ReferenceField(
        'genesisId',
        KartoffelService.getUserById,
        ({ displayName }) => KartoffelService.searchUserByName(displayName),
        'displayName',
        {
            validation: requiredString,
            label: i18next.t('common.username'),
            populatedFieldName: 'kartoffelUser',
            disableFilter: true,
        },
    ),
    new ReferenceField('baseId', BasesService.getById, BasesService.getByQuery, 'name', {
        validation: requiredString,
        label: i18next.t('common.base'),
        getAll: true,
        populatedFieldName: 'base',
    }),
    new TranslatedEnumField('type', UserTypes, 'userTypes', { validation: requiredString, label: i18next.t('common.requestedUserType') }),
];
