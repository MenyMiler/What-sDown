import { ISetFilterParams } from '@ag-grid-community/core';
import React from 'react';
import { Resource } from '../..';
import { Field, IOptions, getColDefReturnType } from '../../Field';
import { onFieldChange } from '../../RelatedFieldsWrapper';
import { HorizontalScroll } from './HorizontalScroll';
import { Input } from './Input';

interface IRelatedFieldOptions extends IOptions {
    getAll: boolean;
    getAutocompleteLabel: (resource: Resource) => string;
    getId: (resource: Resource) => string;
    populatedFieldName: string;
    multiple: boolean;
    disableFilter: boolean;
    numberChipInput: boolean;
}

export interface IAutoCompleteOptions extends Resource {
    id: string;
    label: string;
}

const transformMultipleValue = (value: Resource[]) => value.map(({ _id }) => _id);

export class ReferenceField extends Field {
    public getAll: IRelatedFieldOptions['getAll'] = false;

    public getAutocompleteLabel: IRelatedFieldOptions['getAutocompleteLabel'] = (resource: Resource) => resource[this.propertyName];

    // eslint-disable-next-line class-methods-use-this
    public getId: IRelatedFieldOptions['getId'] = (resource: Resource) => resource?._id;

    public populatedFieldName: IRelatedFieldOptions['populatedFieldName'] | undefined = undefined;

    public multiple: IRelatedFieldOptions['multiple'] = false;

    public disableFilter: IRelatedFieldOptions['disableFilter'] = false;

    public numberChipInput: IRelatedFieldOptions['numberChipInput'] = false;

    public additionalQuery: Record<string, keyof IAutoCompleteOptions> = {};

    public refetchFlag: boolean = false;

    constructor(
        name: string,
        public getById: (id: string) => Promise<Resource>,
        public getMany: (query: Partial<Omit<Resource, '_id'>>) => Promise<Resource[]>,
        public propertyName: string,
        options: Partial<IRelatedFieldOptions> = {},
    ) {
        const { getAll, getAutocompleteLabel, getId, populatedFieldName, multiple, disableFilter, numberChipInput, transformValue, ...rest } =
            options;

        super(name, {
            ...rest,
            validation: options.validation?.nullable(),
            transformValue: transformValue || (multiple ? transformMultipleValue : undefined),
        });

        if (getAll) this.getAll = getAll;
        if (getAutocompleteLabel) this.getAutocompleteLabel = getAutocompleteLabel;
        if (getId) this.getId = getId;
        if (populatedFieldName) this.populatedFieldName = populatedFieldName;
        if (multiple) this.multiple = multiple;
        if (disableFilter) this.disableFilter = disableFilter;
        if (numberChipInput) this.numberChipInput = numberChipInput;
    }

    public setAdditionalQuery(additionalQuery: ReferenceField['additionalQuery']) {
        this.additionalQuery = additionalQuery;
    }

    public refetch() {
        this.refetchFlag = !this.refetchFlag;
    }

    private getValueFromData(data: any): any {
        if (!data) return null;

        return this.populatedFieldName ? data[this.populatedFieldName]?.[this.propertyName] : data[this.propertyName];
    }

    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        const filterParams: ISetFilterParams<Data, any> = {
            keyCreator: ({ value: { _id } }) => _id,
            valueFormatter: ({ value }) => value[this.propertyName],
            values: async (params) => {
                params.success(await this.getMany({}));
            },
        };

        return {
            ...super.getColDef(),
            ...(!this.disableFilter ? { filter: 'agSetColumnFilter', filterParams } : { suppressMenu: true }),
            sortable: false,
            valueFormatter: ({ data }) => this.getValueFromData(data),
            cellRenderer: this.multiple ? ({ value }: any) => <HorizontalScroll items={value} propertyName={this.propertyName} /> : null,
        };
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();
        const options = this.getOptions();

        return <Input field={this} onChange={onChange} inputElementProps={inputElementProps} fieldOptions={options} key={inputElementProps.name} />;
    }
}
