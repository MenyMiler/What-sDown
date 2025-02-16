/* eslint-disable indent */
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RelatedFieldsWrapper } from '.';

interface IInputProps {
    relatedFields: RelatedFieldsWrapper['relatedFields'];
}

export const Input = (props: IInputProps) => {
    const { relatedFields } = props;

    const [rerenderFlag, setRerenderFlag] = useState(false);

    const rerender = () => setRerenderFlag(!rerenderFlag);

    const formContext = useFormContext();

    return (
        <>
            {Object.values(relatedFields).map(({ field, onChange }) =>
                field.getInputElement(
                    onChange
                        ? (value) => {
                              if (!field.isOnChangeIgnored()) return;

                              onChange(value, relatedFields, formContext);

                              rerender();
                          }
                        : undefined,
                ),
            )}
        </>
    );
};
