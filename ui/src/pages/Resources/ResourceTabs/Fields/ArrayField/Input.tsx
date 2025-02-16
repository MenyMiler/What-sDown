/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteElement } from 'react-hook-form-mui';
import { Field } from '../../Field';
import { FieldInputElementWrapper } from '../../FieldInputElementWrapper';
import { onFieldChange } from '../../RelatedFieldsWrapper';

interface IInputProps {
    onInputElementChange: Field['onInputElementChange'];
    inputElementProps: ReturnType<Field['getInputElementProps']>;
    rerenderFlag: boolean;
    onChange?: onFieldChange;
}

export const Input = (props: IInputProps) => {
    const { onInputElementChange, onChange, rerenderFlag, inputElementProps } = props;

    const { setValue, watch } = useFormContext();

    const watchField = watch(inputElementProps.name) || [];

    return (
        <FieldInputElementWrapper name={inputElementProps.name} onChange={onChange} rerenderFlag={rerenderFlag} key={inputElementProps.key}>
            <AutocompleteElement
                {...inputElementProps}
                options={watchField}
                multiple
                autocompleteProps={{
                    multiple: true,
                    freeSolo: true,
                    limitTags: 5,
                    filterOptions: () => [],
                    onChange: (event, value) => {
                        setValue(inputElementProps.name, event.type === 'keydown' ? _.union(watchField, value) : value);
                        onInputElementChange(value, onChange);
                    },
                    sx: inputElementProps.sx,
                }}
                matchId
            />
        </FieldInputElementWrapper>
    );
};
