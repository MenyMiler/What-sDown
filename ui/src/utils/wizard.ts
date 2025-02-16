import { UseFormSetValue, FieldValues } from 'react-hook-form';

export const setValues = <T extends { [key: string]: any }>(values: T, setFieldValue: UseFormSetValue<FieldValues>) => {
    Object.keys(values).forEach((key) => {
        setFieldValue(key, values[key]);
    });
};

export const clearValues = <T extends { [key: string]: any }>(values: T, setFieldValue: UseFormSetValue<FieldValues>) => {
    Object.keys(values).forEach((key) => {
        setFieldValue(key, undefined);
    });
};
