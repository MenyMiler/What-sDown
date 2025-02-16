/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextFieldElement } from 'react-hook-form-mui';
import { Field } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { onFieldChange } from '../RelatedFieldsWrapper';

export class StringField extends Field {
    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <FieldInputElementWrapper name={this.name} onChange={onChange} rerenderFlag={this.rerenderFlag} key={inputElementProps.key}>
                <TextFieldElement {...inputElementProps} onChange={({ target: { value } }) => this.onInputElementChange(value, onChange)} />
            </FieldInputElementWrapper>
        );
    }
}
