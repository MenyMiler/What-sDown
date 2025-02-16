/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { AgGridReact } from '@ag-grid-community/react';
import { Box, GlobalStyles } from '@mui/material';
import { ColumnsToolPanelModule } from '@noam7700/ag-grid-enterprise-column-tool-panel';
import '@noam7700/ag-grid-enterprise-core';
import { MenuModule } from '@noam7700/ag-grid-enterprise-menu';
import { ServerSideRowModelModule } from '@noam7700/ag-grid-enterprise-server-side-row-model';
import { SetFilter, SetFilterModule } from '@noam7700/ag-grid-enterprise-set-filter';
import i18next from 'i18next';
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { environment } from '../../../globals';
import { createDataSource, defaultColDef, searchFunction, sideBar } from '../../../utils/agGrid';
import { DateFilterComponent } from '../../../utils/agGrid/DateFilterComponent';
import { Template } from '../ResourceTabs/templates';
import { IButtonProps, getColumnDefs } from './getColumnDefs';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';
import '../../../css/table.css';

const {
    aggrid: { rowHeight, paginationPageSize, maxBlocksInCache },
} = environment;

export interface ITableRef {
    resetFilter: () => void;
    refreshServerSide: () => void;
}

export interface ITableProps {
    fetchResources: searchFunction;
    template: Template;
    deleteRowButtonProps?: IButtonProps;
    editRowButtonProps?: IButtonProps;
    occupationButtonProps?: IButtonProps;
    soldierAssociationButtonProps?: IButtonProps;
}

export const Table = forwardRef<ITableRef, ITableProps>((props: ITableProps, ref: ForwardedRef<ITableRef>) => {
    const { fetchResources, template, deleteRowButtonProps, editRowButtonProps, occupationButtonProps, soldierAssociationButtonProps } = props;

    const gridRef = useRef<AgGridReact>(null);

    useImperativeHandle(ref, () => ({
        resetFilter() {
            gridRef.current?.api.setFilterModel(null);
        },
        refreshServerSide() {
            gridRef.current?.api.refreshServerSide({ purge: true });
        },
    }));

    const getGlobalStyles = () => ({
        '.ag-column-select-virtual-list-viewport': { height: `${rowHeight * paginationPageSize}px !important` },
        '.ag-center-cols-clipper': { minHeight: `${rowHeight * paginationPageSize}px !important` },
    });

    const columnDefs = getColumnDefs(template, deleteRowButtonProps, editRowButtonProps, occupationButtonProps, soldierAssociationButtonProps);

    const rowModelProps = useMemo<React.ComponentProps<typeof AgGridReact>>(
        () => ({
            rowModelType: 'serverSide',
            serverSideDatasource: createDataSource(fetchResources),
            cacheBlockSize: paginationPageSize,
            maxBlocksInCache,
        }),
        [],
    );

    return (
        <Box>
            <GlobalStyles styles={getGlobalStyles()} />
            <AgGridReact<any>
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                modules={[ServerSideRowModelModule, ColumnsToolPanelModule, MenuModule, SetFilterModule]}
                className="ag-theme-material"
                domLayout="autoHeight"
                rowHeight={rowHeight}
                sideBar={sideBar}
                containerStyle={{ width: '100%', fontFamily: 'Assistant', fontSize: '1rem' }}
                components={{ agDateInput: DateFilterComponent }}
                localeText={i18next.t('agGridLocaleText', { returnObjects: true }) as Record<string, string>}
                pagination
                paginationPageSize={paginationPageSize}
                {...rowModelProps}
                animateRows
                enableRtl
                enableCellTextSelection
                suppressCellFocus
                suppressDragLeaveHidesColumns
            />
        </Box>
    );
});
