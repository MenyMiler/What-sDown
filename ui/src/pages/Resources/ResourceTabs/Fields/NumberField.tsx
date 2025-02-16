/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextFieldElement } from 'react-hook-form-mui';
import { Field, getColDefReturnType } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { onFieldChange } from '../RelatedFieldsWrapper';

export class NumberField extends Field {
    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        return {
            ...super.getColDef(),
            filter: 'agNumberColumnFilter',
            cellStyle: { direction: 'ltr' },
        };
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <FieldInputElementWrapper name={this.name} onChange={onChange} rerenderFlag={this.rerenderFlag} key={inputElementProps.key}>
                <TextFieldElement
                    {...inputElementProps}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={({ target: { value } }) => this.onInputElementChange(value, onChange)}
                />
            </FieldInputElementWrapper>
        );
    }
}
