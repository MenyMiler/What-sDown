import { ColDef } from '@ag-grid-community/core';
import i18next from 'i18next';
import React from 'react';
import * as yup from 'yup';
import { onFieldChange } from './RelatedFieldsWrapper';

export type getColDefReturnType<Data extends any = Field> = ColDef<Data> | null;

export interface IOptions {
    validation: yup.AnySchema;
    disabled: boolean;
    label: string;
    shouldDisplayOnUpdate: boolean;
    transformValue: (value: any) => any;
}

export abstract class Field {
    protected validation: IOptions['validation'] = yup.string().nullable();

    protected disabled: IOptions['disabled'] = false;

    protected label: IOptions['label'] = '';

    protected shouldDisplayOnUpdate: IOptions['shouldDisplayOnUpdate'] = true;

    public transformValue: IOptions['transformValue'] = (value: any) => value; // eslint-disable-line class-methods-use-this

    protected rerenderFlag = false;

    protected previousValue: any;

    protected onChangeIgnoreAmount = 0;

    constructor(protected name: string, { validation, disabled, label, shouldDisplayOnUpdate, transformValue }: Partial<IOptions> = {}) {
        if (validation) this.validation = validation;
        if (disabled) this.disabled = disabled;
        if (label) this.label = label;
        if (shouldDisplayOnUpdate) this.shouldDisplayOnUpdate = shouldDisplayOnUpdate;
        if (transformValue) this.transformValue = transformValue;
    }

    public getName() {
        return this.name;
    }

    public getOptions() {
        return {
            validation: this.validation,
            disabled: this.disabled,
            label: this.label,
            shouldDisplayOnUpdate: this.shouldDisplayOnUpdate,
            transformValue: this.transformValue,
        };
    }

    public getRerenderFlag() {
        return this.rerenderFlag;
    }

    public getPreviousValue() {
        return this.previousValue;
    }

    public getOnChangeIgnoreAmount() {
        return this.onChangeIgnoreAmount;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setOptions(options: Partial<IOptions>) {
        Object.entries(options).forEach(([key, value]: [string, any]) => {
            if (value !== undefined) this[key as keyof Field] = value;
        });
    }

    public setRerenderFlag(value: Field['rerenderFlag']) {
        this.rerenderFlag = value;
    }

    public setPreviousValue(value: Field['previousValue']) {
        this.previousValue = value;
    }

    public setOnChangeIgnoreAmount(value: Field['onChangeIgnoreAmount']) {
        this.onChangeIgnoreAmount = value;
    }

    public rerender() {
        this.setRerenderFlag(!this.rerenderFlag);
    }

    public isOnChangeIgnored() {
        // console.log(this.name, this.onChangeIgnoreAmount);

        if (this.onChangeIgnoreAmount > 0) this.onChangeIgnoreAmount--;
        return !this.onChangeIgnoreAmount;
    }

    public onClose() {
        this.setPreviousValue(undefined);
    }

    public onInputElementChange(value: unknown, onChange?: onFieldChange) {
        onChange?.(value);
        this.setPreviousValue(value);
    }

    private getHeaderName() {
        let headerName = '';

        if (this.label) headerName = this.label;
        else if (i18next.exists(`common.${this.name}`)) headerName = i18next.t(`common.${this.name}`);
        else headerName = this.name;

        return headerName;
    }

    public getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        return {
            field: this.name,
            headerName: this.getHeaderName(),
            valueGetter: ({ data }) => (data ? (data as any)[this.name] : undefined),
            filter: 'agTextColumnFilter',
        };
    }

    protected getInputElementProps() {
        return {
            key: this.name,
            name: this.name,
            label: this.label || i18next.t(`common.${this.name}`) || '',
            required: !this.validation?.describe().optional,
            disabled: this.disabled,
            sx: { width: '40%' },
        };
    }

    public abstract getInputElement(onChange?: onFieldChange): React.ReactElement;
}
