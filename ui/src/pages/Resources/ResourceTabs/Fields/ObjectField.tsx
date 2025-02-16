import { Box } from '@mui/material';
import React from 'react';
import * as yup from 'yup';
import { Field, getColDefReturnType } from '../Field';
import { FieldInputElementWrapper } from '../FieldInputElementWrapper';
import { RelatedFieldsWrapper } from '../RelatedFieldsWrapper';
import { Template, getSchema } from '../templates';

export class ObjectField extends Field {
    constructor(name: string, private fields: Template) {
        super(name, {
            validation: yup.object(getSchema(fields)).nullable(),
        });
    }

    public override onClose() {
        this.fields.forEach((field) => field.onClose());
    }

    // eslint-disable-next-line class-methods-use-this
    public override getColDef<Data extends any = Field>(): getColDefReturnType<Data> {
        return null;
    }

    private getNestedFieldInputElement(field: Field | RelatedFieldsWrapper): React.ReactElement {
        if (field instanceof Field) {
            const fieldName = field.getName();
            if (!fieldName.includes(this.name)) field.setName(`${this.name}.${fieldName}`);
            return field.getInputElement();
        }
        return <>{field.getFields().flatMap((nestedField) => this.getNestedFieldInputElement(nestedField))}</>;
    }

    public getInputElement(): React.ReactElement {
        return (
            <FieldInputElementWrapper name={this.name} rerenderFlag={this.rerenderFlag}>
                <Box
                    key={this.name}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        border: '1px solid gray',
                        borderRadius: '10px',
                        paddingY: '1.5rem',
                        paddingX: '1rem',
                    }}
                >
                    {this.fields.flatMap((field) => this.getNestedFieldInputElement(field))}
                </Box>
            </FieldInputElementWrapper>
        );
    }
}
