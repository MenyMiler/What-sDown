/* eslint-disable @typescript-eslint/no-shadow */
import { yupResolver } from '@hookform/resolvers/yup';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { toast } from 'react-toastify';
import { ImportResources, importResourcesSchema } from '../../common/Modals/newResourceModal/importResources';
import { ActionTypes, ActivityTypes } from '../../interfaces/activityLogs';
import { ActivityLogService } from '../../services/activityLogs';
import { useUserStore } from '../../stores/user';
import { IResourceTab } from './ResourceTabs';

const formId = 'excel-form';

interface IUploadExcelDialogProps {
    open: boolean;
    handleClose: () => void;
    excel: NonNullable<IResourceTab['excel']>;
}

export const UploadExcelDialog = (props: IUploadExcelDialogProps) => {
    const { open, handleClose, excel } = props;
    const currentUser = useUserStore((state) => state.user);

    const { mutate: onSuccess, isPending } = useMutation({
        mutationFn: (data: { excelData: any[] } & Record<string, any>) =>
            excel.createMany(
                data.excelData.map((resource) =>
                    _.pickBy(
                        {
                            ...{ ...resource, name: String(resource.name) },
                            ...(excel.additionalFields ? excel.additionalFields.reduce((acc, field) => ({ ...acc, [field]: data[field] }), {}) : {}),
                        },
                        (value) => value !== undefined && value !== null && value !== '',
                    ),
                ),
            ),

        onSuccess: (_, variables) => {
            const { excelData } = variables;
            toast.success(i18next.t('wizard.creationSuccess'));
            ActivityLogService.createOne({
                name: localStorage.getItem('excelName')!,
                userId: currentUser.genesisId,
                type: ActivityTypes.EXCEL,
                action: ActionTypes.ADD,
                metaData: { excelData },
            });
            handleClose();
        },
        onError: (error: any) => {
            if (error.response?.data?.message?.includes('duplicate')) toast.error(i18next.t('excelCategories.errors.duplicateData'));
            else toast.error(i18next.t('wizard.error'));
        },
    });

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth scroll="paper" sx={{ textAlign: 'center' }}>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <Close />
            </IconButton>

            <DialogTitle>{i18next.t('wizard.importResources.title')}</DialogTitle>

            <DialogContent dividers sx={{ textAlign: 'left' }}>
                <FormContainer
                    onSuccess={(data: any) => onSuccess(data)}
                    resolver={yupResolver(importResourcesSchema)}
                    mode="onChange"
                    FormProps={{ id: formId }}
                >
                    <ImportResources resourceType={excel.resourceType} />
                </FormContainer>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={isPending}>
                    {i18next.t('table.cancel')}
                </Button>
                <LoadingButton variant="text" type="submit" form={formId} loading={isPending}>
                    {i18next.t('resources.upload')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
