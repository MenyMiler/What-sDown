import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { AddParameters } from '../../../../utils/types';
import { Field } from '../Field';
import { ReferenceField, SearchField } from '../Fields';
import { Input } from './Input';

export type onFieldChange = (value: any) => void;

export type onFieldChangeWrapper = AddParameters<onFieldChange, [relatedFields: RelatedFieldsWrapper['relatedFields'], formContext: UseFormReturn]>;

export interface IRelatedField {
    field: Field;
    onChange?: onFieldChangeWrapper;
    initialOnChangeIgnoreAmount?: number;
}

export class RelatedFieldsWrapper {
    private id: string;

    private relatedFields: Record<string, IRelatedField> = {};

    private fields: Field[] = [];

    constructor(relatedFields: IRelatedField[]) {
        for (let index = 0; index < relatedFields.length; index++) {
            const { field } = relatedFields[index];
            this.fields[index] = field;
            field.setOnChangeIgnoreAmount(relatedFields[index].initialOnChangeIgnoreAmount || 0);
            this.relatedFields[field.getName()] = relatedFields[index];
        }

        this.id = uuid();
    }

    public onClose() {
        this.fields.forEach((field) => {
            field.setOnChangeIgnoreAmount(this.relatedFields[field.getName()].initialOnChangeIgnoreAmount || 0);
            field.onClose();
        });
    }

    public getFields() {
        return this.fields;
    }

    // query should be in format { fieldName: valuePropertyName }
    // for example { baseId: 'id' } where 'baseId' is the name of the field to query and 'id' is the name of the property in the value
    public static populateQueryWithValues<T = Record<string, any>>(query: Record<string, keyof T>, value: T) {
        return _.mapValues(query, (param) => (value ? value[param] : undefined));
    }

    private static clearFieldValue(self: Field, formContext: UseFormReturn, value: any, otherFieldName: string) {
        if (value !== undefined && self.getPreviousValue() !== undefined) formContext.resetField(otherFieldName);
    }

    public static setSelectFieldOptions(
        value: any,
        relatedFields: RelatedFieldsWrapper['relatedFields'],
        formContext: UseFormReturn,
        selfName: string,
        otherName: string,
        propertyName: string,
    ) {
        const self = relatedFields[selfName].field as SearchField;
        const other = relatedFields[otherName].field as SearchField;

        other.setSelectOptions(value ? value[propertyName] : []);

        this.clearFieldValue(self, formContext, value, otherName);
    }

    public static setReferenceFieldValueOnChange(
        value: any,
        relatedFields: RelatedFieldsWrapper['relatedFields'],
        formContext: UseFormReturn,
        selfName: string,
        relatedToName: string,
        additionalQuery?: ReferenceField['additionalQuery'],
    ) {
        const self = relatedFields[selfName].field as ReferenceField;
        const relatedTo = relatedFields[relatedToName].field as ReferenceField;

        this.clearFieldValue(self, formContext, value, relatedToName);

        // console.log({ selfName, relatedToName, value });

        relatedTo.setOptions({ disabled: !value });
        if (additionalQuery) relatedTo.setAdditionalQuery(additionalQuery);

        // relatedFields[relatedToName].onChange?.(formContext.getValues(relatedToName), relatedFields, formContext);
        relatedTo.refetch();
        // relatedTo.rerender();
    }

    public static setReferenceFieldValueOnOpen(
        value: any,
        relatedFields: RelatedFieldsWrapper['relatedFields'],
        formContext: UseFormReturn,
        relatedToName: string,
        propertyName: string,
    ) {
        const relatedTo = relatedFields[relatedToName].field as ReferenceField;

        if (!value || formContext.getValues(relatedToName) !== undefined) return;

        formContext.setValue(relatedToName, value[propertyName]);

        // relatedTo.setOptions({ disabled: !value });

        // relatedFields[relatedToName].onChange?.(formContext.getValues(relatedToName), relatedFields, formContext);
        relatedTo.refetch();
        // relatedTo.rerender();
    }

    public getInputElement(): React.ReactElement {
        return <Input relatedFields={this.relatedFields} key={this.id} />;
    }
}
