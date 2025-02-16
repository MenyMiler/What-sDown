import { yupResolver } from '@hookform/resolvers/yup';
import { Close } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { IResourceTab, Resource } from './ResourceTabs';
import { getFieldFromTemplate, getSchema } from './ResourceTabs/templates';
import { ITableRef } from './Table';

interface IResourceDialogProps {
    open: boolean;
    title: string;
    actionButtonTitle: string;
    handleClose: () => void;
    handleAction: (data: Partial<Omit<Resource, '_id'>>) => Promise<Resource>;
    successMessage: string;
    errorMessage: string;
    tableRef: React.RefObject<ITableRef>;
    template: IResourceTab['template'];
    resource: Resource | null;
    fieldsToRemove: IResourceTab['fieldsToRemove'];
}

const formId = 'resource-form';

export const ResourceDialog = (props: IResourceDialogProps) => {
    const {
        open,
        title,
        actionButtonTitle,
        handleClose,
        handleAction,
        successMessage,
        errorMessage,
        tableRef,
        template,
        resource,
        fieldsToRemove = [],
    } = props;

    const schema = useMemo(() => yup.object(getSchema(template)), [template]);

    const { mutate: onSuccess, isPending } = useMutation({
        mutationFn: async ({ _id, ...data }: Resource | Partial<Resource>) => {
            const transformedData = _.mapValues(data, (value, key) => {
                if (!resource && (value === '' || value === null)) return undefined;
                if (resource && value === '') return null;
                return getFieldFromTemplate(template, key)?.transformValue(value) ?? value;
            });

            fieldsToRemove.forEach((field) => delete transformedData[field]);

            await handleAction(transformedData);
        },
        onSuccess: () => {
            toast.success(successMessage);
            tableRef.current?.refreshServerSide();
            handleClose();
        },
        onError: () => {
            toast.error(errorMessage);
        },
    });

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth scroll="paper" sx={{ textAlign: 'center' }}>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <Close />
            </IconButton>

            <DialogTitle>{title}</DialogTitle>

            <DialogContent dividers sx={{ textAlign: 'left' }}>
                <FormContainer
                    onSuccess={(data) => onSuccess(data)}
                    resolver={yupResolver(schema)}
                    mode="onChange"
                    defaultValues={resource ?? {}}
                    FormProps={{ id: formId, style: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' } }}
                >
                    {template.map((field) => field.getInputElement())}
                </FormContainer>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={isPending}>
                    {i18next.t('table.cancel')}
                </Button>
                <LoadingButton variant="text" type="submit" form={formId} loading={isPending}>
                    {actionButtonTitle}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
