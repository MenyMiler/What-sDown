/* eslint-disable react/require-default-props */
import i18next from 'i18next';
import React, { ChangeEvent } from 'react';
import { TextFieldElement } from 'react-hook-form-mui';

interface ITextFieldElementForGenderProps {
    name: string;
    disabled?: boolean;
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextFieldElementForGender = ({ name, disabled = false, handleChange }: ITextFieldElementForGenderProps) => (
    <TextFieldElement
        disabled={disabled}
        type="number"
        name={disabled ? `soldierAmountsDestCourse.${name}` : `soldierAmounts.${name}`}
        InputProps={{
            inputProps: { min: 0 },
            onChange: handleChange,
            classes: {
                notchedOutline: disabled ? 'genders-elements-border' : '',
            },
        }}
        label={i18next.t(`wizard.editSoldierAmountsInCourseRequest.${name}`)}
    />
);

export default TextFieldElementForGender;
