/* eslint-disable react/jsx-props-no-spreading */
import { ISetFilterParams, ValueFormatterParams } from '@ag-grid-community/core';
import i18next from 'i18next';
import React from 'react';
import { SwitchElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { agGridLocaleText } from '../../../../utils/agGrid/agGridLocaleText';
import { Field, IOptions, getColDefReturnType } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { onFieldChange } from '../RelatedFieldsWrapper';

type booleanField = boolean | undefined;

export class BooleanField extends Field {
    constructor(name: string, options: Partial<Omit<IOptions, 'validation'>> = {}) {
        super(name, { ...options, validation: yup.boolean().typeError(i18next.t('yupErrorMsg.boolean')) });
    }

    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        const formatValue = (propertyValue: booleanField) =>
            String(propertyValue) === 'true' || String(propertyValue) === 'false' ? i18next.t(`common.${propertyValue}`) : '';

        const valueFormatter = ({ value }: ValueFormatterParams<Data, booleanField>) =>
            value === null ? agGridLocaleText.blanks : formatValue(value);

        const filterParams: ISetFilterParams<Data, booleanField> = {
            valueFormatter,
            suppressMiniFilter: true,
            values: [true, false, undefined],
        };

        return {
            ...super.getColDef(),
            filter: 'agSetColumnFilter',
            filterParams,
            valueFormatter,
        };
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <FieldInputElementWrapper name={this.name} onChange={onChange} rerenderFlag={this.rerenderFlag} key={inputElementProps.key}>
                <SwitchElement
                    {...inputElementProps}
                    sx={{ width: '40%', justifyContent: 'center' }}
                    labelPlacement="start"
                    onChange={(_event, value) => this.onInputElementChange(value, onChange)}
                />
            </FieldInputElementWrapper>
        );
    }
}
