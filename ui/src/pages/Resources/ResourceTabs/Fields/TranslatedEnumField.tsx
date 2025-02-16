/* eslint-disable react/jsx-props-no-spreading */
import { ISetFilterParams, ValueFormatterParams } from '@ag-grid-community/core';
import i18next from 'i18next';
import React from 'react';
import { SelectElement } from 'react-hook-form-mui';
import { agGridLocaleText } from '../../../../utils/agGrid/agGridLocaleText';
import { Field, IOptions, getColDefReturnType } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { onFieldChange } from '../RelatedFieldsWrapper';

type translatedEnumField = string | undefined;

export class TranslatedEnumField extends Field {
    private translatedEnum: Record<string, string>;

    constructor(name: string, enumToBeTranslated: any, private translationPath: string, options: Partial<IOptions> = {}) {
        super(name, options);
        this.translatedEnum = this.getTranslatedEnum(enumToBeTranslated);
    }

    private getTranslatedEnum(enumToBeTranslated: any): Record<string, string> {
        return Object.fromEntries(Object.values(enumToBeTranslated).map((value) => [value, i18next.t(`${this.translationPath}.${value}`)]));
    }

    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        const formatValue = (propertyValue: translatedEnumField) => (propertyValue ? this.translatedEnum[propertyValue] : '');

        const valueFormatter = ({ value }: ValueFormatterParams<Data, translatedEnumField>) =>
            value === null ? agGridLocaleText.blanks : formatValue(value);

        const filterParams: ISetFilterParams<Data, translatedEnumField> = {
            valueFormatter,
            suppressMiniFilter: true,
            values: [...Object.keys(this.translatedEnum), undefined],
        };

        return {
            ...super.getColDef(),
            filter: 'agSetColumnFilter',
            filterParams,
            valueFormatter,
            sortable: false,
        };
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <FieldInputElementWrapper name={this.name} onChange={onChange} rerenderFlag={this.rerenderFlag} key={inputElementProps.key}>
                <SelectElement
                    {...inputElementProps}
                    options={Object.entries(this.translatedEnum).map(([id, label]) => ({ id, label }))}
                    onChange={(value) => this.onInputElementChange(value, onChange)}
                />
            </FieldInputElementWrapper>
        );
    }
}
