/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Field } from './Field';
import { onFieldChange } from './RelatedFieldsWrapper';

interface IFieldInputElementWrapperProps {
    name: Field['name'];
    rerenderFlag: boolean;
    onChange?: onFieldChange;
    shouldOnChangeOnFirstRender?: boolean;
    children: React.ReactNode;
}

export const FieldInputElementWrapper = (props: IFieldInputElementWrapperProps) => {
    const { name, rerenderFlag, onChange, shouldOnChangeOnFirstRender = true, children } = props;

    const [firstRender, setFirstRender] = useState(true);

    const { getValues } = useFormContext();

    useEffect(() => {
        // console.log({ name, firstRender, shouldOnChangeOnFirstRender });

        if (firstRender) setFirstRender(false);
        if (firstRender && !shouldOnChangeOnFirstRender) return;

        onChange?.(getValues(name));
    }, [rerenderFlag]);

    return <>{children} </>;
};
