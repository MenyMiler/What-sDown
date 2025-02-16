import { ColDef } from '@ag-grid-community/core';
import { DeleteOutlined, EditOutlined, HelpOutline } from '@mui/icons-material';
import i18next from 'i18next';
import React, { memo } from 'react';
import { IconButtonWithTooltip } from '../../../common/IconButtonWithTooltip';
import { environment } from '../../../globals';
import { filteredMap } from '../../../utils';
import { Field } from '../ResourceTabs/Field';
import { Template } from '../ResourceTabs/templates';

const {
    aggrid: { cellPadding, iconButtonWidth, headerNameWidth },
} = environment;

export interface IButtonProps {
    onClick: (resource: any) => void;
    disabled?: boolean;
}

export const getColumnDefs = <Data extends any = Field>(
    template: Template,
    deleteRowButtonProps?: IButtonProps,
    editRowButtonProps?: IButtonProps,
    occupationButtonProps?: IButtonProps,
    soldierAssociationButtonProps?: IButtonProps,
) => {
    const columnDefs = filteredMap(
        template,
        (field) => {
            const value = field instanceof Field ? field.getColDef() : field.getFields();

            return { value, include: value !== null };
        },
        true,
    ) as ColDef<Data>[];

    if (deleteRowButtonProps || editRowButtonProps) {
        const numberOfButtons =
            Number(Boolean(deleteRowButtonProps)) +
            Number(Boolean(editRowButtonProps)) +
            Number(Boolean(occupationButtonProps)) +
            Number(Boolean(soldierAssociationButtonProps));
        const widthToFitButtons = cellPadding + numberOfButtons * iconButtonWidth;
        const columnWidth = Math.max(headerNameWidth, widthToFitButtons);

        columnDefs.push({
            headerName: i18next.t('table.actions'),
            pinned: 'left',
            menuTabs: [],
            sortable: false,
            width: columnWidth,
            minWidth: columnWidth,
            flex: 0,
            resizable: false,
            lockPosition: true,
            suppressColumnsToolPanel: true,
            // eslint-disable-next-line react/prop-types
            cellRenderer: memo<{ data: Data }>(({ data }) => (
                <div>
                    {occupationButtonProps && (
                        <IconButtonWithTooltip
                            popoverText={i18next.t('table.checkOccupation')}
                            iconButtonProps={{
                                disabled: false,
                                onClick: () => occupationButtonProps.onClick(data),
                            }}
                        >
                            <HelpOutline />
                        </IconButtonWithTooltip>
                    )}
                    {soldierAssociationButtonProps && (
                        <IconButtonWithTooltip
                            popoverText={i18next.t('table.checkAssociation')}
                            iconButtonProps={{
                                disabled: false,
                                onClick: () => soldierAssociationButtonProps.onClick(data),
                            }}
                        >
                            <HelpOutline />
                        </IconButtonWithTooltip>
                    )}
                    {editRowButtonProps && (
                        <IconButtonWithTooltip
                            popoverText={i18next.t('table.edit')}
                            iconButtonProps={{
                                disabled: editRowButtonProps.disabled,
                                onClick: () => editRowButtonProps.onClick(data),
                            }}
                        >
                            <EditOutlined />
                        </IconButtonWithTooltip>
                    )}
                    {deleteRowButtonProps && (
                        <IconButtonWithTooltip
                            popoverText={i18next.t('table.delete')}
                            iconButtonProps={{
                                disabled: deleteRowButtonProps.disabled,
                                onClick: () => deleteRowButtonProps.onClick(data),
                            }}
                        >
                            <DeleteOutlined />
                        </IconButtonWithTooltip>
                    )}
                </div>
            )),
        });
    }

    return columnDefs;
};
