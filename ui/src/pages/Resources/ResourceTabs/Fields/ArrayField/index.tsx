import { ValueFormatterParams } from '@ag-grid-community/core';
import React from 'react';
import { Field, getColDefReturnType } from '../../Field';
import { onFieldChange } from '../../RelatedFieldsWrapper';
import { Input } from './Input';

type arrayField = string[] | undefined;

export class ArrayField extends Field {
    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        const formatValue = (propertyValue: arrayField) => (propertyValue ? propertyValue.join(', ') : '');

        return {
            ...super.getColDef(),
            valueFormatter: ({ value }: ValueFormatterParams<Data, arrayField>) => formatValue(value),
        };
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <Input
                onInputElementChange={this.onInputElementChange}
                rerenderFlag={this.rerenderFlag}
                onChange={onChange}
                inputElementProps={inputElementProps}
                key={inputElementProps.name}
            />
        );
    }
}
