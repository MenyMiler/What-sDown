/* eslint-disable react/require-default-props */
import i18next from 'i18next';
import React from 'react';
import { TextFieldElement } from 'react-hook-form-mui';

interface ITextFieldElementForGenderProps {
    gender: string;
}

const TextFieldElementForGender = ({ gender }: ITextFieldElementForGenderProps) => {
    return (
        <TextFieldElement
            type="number"
            name={gender}
            InputProps={{ inputProps: { min: 0 } }}
            label={i18next.t(`wizard.editSoldierAmountsInCourseRequest.${gender}`)}
        />
    );
};

export default TextFieldElementForGender;
