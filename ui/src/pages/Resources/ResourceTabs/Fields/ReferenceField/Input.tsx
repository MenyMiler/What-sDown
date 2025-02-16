/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { AutocompleteInputChangeReason, AutocompleteRenderGetTagProps, Chip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteElement } from 'react-hook-form-mui';
import { toast } from 'react-toastify';
import { IAutoCompleteOptions, ReferenceField } from '.';
import { Resource } from '../..';
import { environment } from '../../../../../globals';
import { Field } from '../../Field';
import { FieldInputElementWrapper } from '../../FieldInputElementWrapper';
import { onFieldChange } from '../../RelatedFieldsWrapper';
import { NumberInput } from './NumberInput';

interface IInputProps {
    field: ReferenceField;
    onChange?: onFieldChange;
    inputElementProps: ReturnType<Field['getInputElementProps']>;
    fieldOptions: ReturnType<Field['getOptions']>;
}

export const Input = (props: IInputProps) => {
    const { field, onChange, inputElementProps, fieldOptions } = props;

    const { getById, getMany, propertyName, getAll, additionalQuery, refetchFlag, populatedFieldName, multiple, numberChipInput } = field;

    const name = field.getName();

    const [options, setOptions] = useState<IAutoCompleteOptions[]>([]);

    const { setValue, getValues } = useFormContext();

    const resourceId = getValues(name) || getValues(populatedFieldName ?? '')?._id;

    const formatAutocompleteOptions = (resource: Resource): IAutoCompleteOptions => ({
        ...resource,
        id: field.getId(resource),
        label: String(field.getAutocompleteLabel(resource)),
    });

    const handleChange = (newValue?: IAutoCompleteOptions) => field.onInputElementChange(newValue, onChange);

    const { mutate: setOptionsWrapper, isPending } = useMutation({
        mutationFn: (requestFunction: () => Promise<IAutoCompleteOptions[]>) => requestFunction(),
        onSuccess: (newOptions) => {
            handleChange(newOptions.find(({ id }) => id === resourceId));

            setOptions(newOptions);
        },
        onError: () => toast.error(i18next.t('resources.failedToGetResources')),
    });

    const searchResources = async (_event: React.SyntheticEvent, input: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input' || reason === 'clear') setValue(name, '');

        if (reason === 'clear') {
            setOptions([]);
            return;
        }

        if (!input) return;

        setOptionsWrapper(async () =>
            (await getMany({ [propertyName]: input, ...additionalQuery, limit: environment.pagination.limit })).map(formatAutocompleteOptions),
        );
    };

    useEffect(() => {
        if (inputElementProps.disabled) return;

        if (getAll) setOptionsWrapper(async () => (await getMany(additionalQuery)).map(formatAutocompleteOptions));
        else if (resourceId) setOptionsWrapper(async () => [formatAutocompleteOptions(await getById(resourceId))]);
    }, [refetchFlag, resourceId]);

    // useEffect(() => handleChange(options.find((option) => option.id === resourceId)), [resourceId]);

    const renderTags = (tags: (IAutoCompleteOptions | undefined)[], getTagProps: AutocompleteRenderGetTagProps) =>
        tags.map((tag, index) => (
            <Chip
                variant="outlined"
                label={<NumberInput tag={tag} populatedFieldName={populatedFieldName!} propertyName={propertyName} />}
                {...getTagProps({ index })}
                sx={{ height: 'auto' }}
                key={tag?._id}
            />
        ));

    const multipleOptions = {
        limitTags: 3,
        isOptionEqualToValue: (option: IAutoCompleteOptions, value: Resource) => option?.id === value?._id,
        getOptionLabel: (option: IAutoCompleteOptions) => option?.[propertyName] ?? '',
    };

    return (
        <FieldInputElementWrapper
            name={field.getName()}
            onChange={onChange}
            shouldOnChangeOnFirstRender={false}
            rerenderFlag={field.getRerenderFlag()}
            key={inputElementProps.key}
        >
            <AutocompleteElement
                {...inputElementProps}
                options={options}
                loading={isPending}
                multiple={multiple}
                showCheckbox={multiple}
                matchId={!multiple}
                autocompleteProps={{
                    freeSolo: !getAll,
                    onInputChange: !getAll ? _.debounce(searchResources, 500) : undefined,
                    sx: inputElementProps.sx,
                    disabled: fieldOptions.disabled,
                    onChange: (_event, value: IAutoCompleteOptions) => handleChange(value),
                    ...(multiple ? multipleOptions : {}),
                    renderTags: numberChipInput ? renderTags : undefined,
                }}
            />
        </FieldInputElementWrapper>
    );
};
