/* eslint-disable react/jsx-props-no-spreading */
import { ValueFormatterParams } from '@ag-grid-community/core';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { LocalizationProvider, PickersLocaleText } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import i18next from 'i18next';
import React from 'react';
import { DatePickerElement } from 'react-hook-form-mui';
import { convertDateTolocaleString } from '../../../../utils/today';
import { Field, getColDefReturnType } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { onFieldChange } from '../RelatedFieldsWrapper';

type dateField = string | undefined;

export class DateField extends Field {
    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        const valueFormatter = (propertyValue: dateField) => (propertyValue ? convertDateTolocaleString(propertyValue) : '');

        const filterParams = {
            comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
                if (!cellValue) return 0;

                const cellDate = new Date(cellValue);

                if (cellDate < filterLocalDateAtMidnight) return -1;
                if (cellDate > filterLocalDateAtMidnight) return 1;

                return 0;
            },

            valueFormatter,
        };

        return {
            ...super.getColDef(),
            filter: 'agDateColumnFilter',
            filterParams,
            valueFormatter: ({ value }: ValueFormatterParams<Data, dateField>) => valueFormatter(value),
        };
    }

    public getInputElement(onChange?: onFieldChange): React.ReactElement {
        const inputElementProps = this.getInputElementProps();

        return (
            <FieldInputElementWrapper name={this.name} onChange={onChange} rerenderFlag={this.rerenderFlag} key={inputElementProps.key}>
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={he}
                    localeText={i18next.t('muiDatePickersLocaleText', { returnObjects: true }) as Partial<PickersLocaleText<unknown>>}
                >
                    <DatePickerElement
                        {...inputElementProps}
                        views={['day']}
                        inputFormat="dd/MM/yyyy"
                        components={{ LeftArrowIcon: ArrowForwardIos, RightArrowIcon: ArrowBackIos }}
                        onChange={(value: Date) => this.onInputElementChange(value, onChange)}
                        inputProps={{ sx: inputElementProps.sx }}
                    />
                </LocalizationProvider>
            </FieldInputElementWrapper>
        );
    }
}
