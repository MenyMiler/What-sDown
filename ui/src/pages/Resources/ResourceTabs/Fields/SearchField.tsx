/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash';
import React from 'react';
import { AutocompleteElement } from 'react-hook-form-mui';
import { Field, IOptions } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { onFieldChange } from '../RelatedFieldsWrapper';

export class SearchField extends Field {
    constructor(name: string, private selectOptions: string[] = [], options: Partial<IOptions> = {}) {
        super(name, { ...options, validation: options.validation?.nullable() });
    }

    public setSelectOptions(selectOptions: string[]) {
        this.selectOptions = selectOptions;
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <FieldInputElementWrapper name={this.name} onChange={onChange} rerenderFlag={this.rerenderFlag} key={inputElementProps.key}>
                <AutocompleteElement
                    {...inputElementProps}
                    options={this.selectOptions}
                    autocompleteProps={{
                        sx: inputElementProps.sx,
                        onChange: (_event, value) => this.onInputElementChange(value, onChange),
                        isOptionEqualToValue: _.isEqual,
                    }}
                    matchId
                />
            </FieldInputElementWrapper>
        );
    }
}
