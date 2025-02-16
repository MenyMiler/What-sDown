import i18next from 'i18next';
import * as yup from 'yup';
import '../i18n';
import { Genders, SpecialGenders } from '../interfaces/soldier';

export const yupRequire = <T extends yup.AnySchema>(schema: T): T => schema.required(i18next.t('yupErrorMsg.required'));

export const requiredString = yupRequire(yup.string());

export const date = yup
    .date()
    .typeError(i18next.t('yupErrorMsg.date'))
    .nullable()
    .transform((currentValue, originalValue) => (originalValue === '' ? null : currentValue));

export const greaterThanDate = (dateName: string) => date.min(yup.ref(dateName), i18next.t('yupErrorMsg.greaterThanDate'));

export const optionalNumber = yup
    .string()
    .nullable()
    .matches(/^[0-9]+$/, { message: i18next.t('yupErrorMsg.number'), excludeEmptyString: true });

export const minMax = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER - 1) =>
    yupRequire(
        yup
            .number()
            .typeError(i18next.t('yupErrorMsg.number'))
            .min(min, i18next.t('yupErrorMsg.greaterThan', { count: min - 1 }))
            .max(max, i18next.t('yupErrorMsg.lowerThan', { count: max + 1 })),
    );

export const genders = [Genders.MALE, Genders.FEMALE, SpecialGenders.SPECIAL_MALE, SpecialGenders.SPECIAL_FEMALE];
export const otherGenders = [Genders.OTHER_MALE, Genders.OTHER_FEMALE, SpecialGenders.SPECIAL_OTHER_MALE, SpecialGenders.SPECIAL_OTHER_FEMALE];

const allGenders = [...genders, ...otherGenders];
export const getGendersAsObject = (value: any) => Object.fromEntries(allGenders.map((gender) => [gender, value])) as any;
export const getGendersAsYupObject = () => yup.object({ ...Object.fromEntries(allGenders.map((gender) => [gender, minMax(0)])) });

export const requiredBoolean = yupRequire(yup.boolean().typeError(i18next.t('yupErrorMsg.boolean')));

export const requiredArray = yupRequire(yup.array().min(1, i18next.t('yupErrorMsg.minOne')).typeError(i18next.t('yupErrorMsg.array')));
