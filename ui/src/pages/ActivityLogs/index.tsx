import { ColDef, IServerSideDatasource } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { Box, GlobalStyles } from '@mui/material';
import { ColumnsToolPanelModule } from '@noam7700/ag-grid-enterprise-column-tool-panel';
import { MenuModule } from '@noam7700/ag-grid-enterprise-menu';
import { ServerSideRowModelModule } from '@noam7700/ag-grid-enterprise-server-side-row-model';
import { SetFilterModule } from '@noam7700/ag-grid-enterprise-set-filter';
import i18next from 'i18next';
import React, { useMemo } from 'react';
import { environment } from '../../globals';
import { ActivityLogService } from '../../services/activityLogs';
import { createDataSource, defaultColDef, sideBar } from '../../utils/agGrid';
import { DateFilterComponent } from '../../utils/agGrid/DateFilterComponent';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';
import '../../css/table.css';
import { ActionTypes, ActivityTypes } from '../../interfaces/activityLogs';
import ShowMoreInfoButton from './showInfoButton';

const ActivityLogPage = () => {
    const columns: ColDef<any>[] = [
        {
            headerName: i18next.t('activityLogs.types.title'),
            field: 'type',
            filter: 'agSetColumnFilter',
            valueFormatter: ({ value }) => i18next.t(`activityLogs.types.${value}`),
            filterParams: {
                valueFormatter: ({ value }: { value: ActivityTypes }) => i18next.t(`activityLogs.types.${value}`),
                suppressMiniFilter: true,
                values: Object.keys(ActivityTypes),
            },
        },
        {
            headerName: i18next.t('activityLogs.actionTypes.title'),
            field: 'action',
            filter: 'agSetColumnFilter',
            valueFormatter: ({ value }) => i18next.t(`activityLogs.actionTypes.${value}`),
            filterParams: {
                valueFormatter: ({ value }: { value: ActionTypes }) => i18next.t(`activityLogs.actionTypes.${value}`),
                suppressMiniFilter: true,
                values: Object.keys(ActionTypes),
            },
        },
        { headerName: i18next.t('activityLogs.name'), field: 'name', filter: 'agTextColumnFilter' },
        {
            headerName: i18next.t('activityLogs.nameAfterChange'),
            field: 'metaData.name',
            valueGetter: (params) => {
                return params.data.action === 'EDIT'
                    ? params.data.metaData.changes.map((change: any) => {
                          return i18next.t(`activityLogs.metaData.${change.path}`, { context: 'title' });
                      })
                    : null;
            },
            suppressMenu: true,
            hide: false,
        },
        { headerName: i18next.t('activityLogs.changer'), field: 'userId', suppressMenu: true },
        {
            headerName: i18next.t('activityLogs.date'),
            field: 'createdAt',
            valueFormatter: ({ value }) => {
                if (!value) return '';
                const date = new Date(value);
                return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })}`;
            },
            filter: 'agDateColumnFilter',
        },
        {
            headerName: i18next.t('activityLogs.moreDetails'),
            field: 'actions',
            // eslint-disable-next-line react/no-unstable-nested-components
            cellRendererFramework: (params: { data: any }) => <ShowMoreInfoButton data={params.data} />,
            filter: false,
            minWidth: 150,
        },
    ];

    const getGlobalStyles = () => ({
        '.ag-column-select-virtual-list-viewport': { height: `${50 * 10}px !important` },
        '.ag-center-cols-clipper': { minHeight: `${50 * 10}px !important` },
    });

    interface RowModelProps {
        rowModelType: 'serverSide';
        serverSideDatasource: IServerSideDatasource;
        cacheBlockSize: number;
        maxBlocksInCache: number;
    }

    const rowModelProps = useMemo<RowModelProps>(
        () => ({
            rowModelType: 'serverSide',
            serverSideDatasource: createDataSource(ActivityLogService.search),
            cacheBlockSize: environment.aggrid.paginationPageSize,
            maxBlocksInCache: environment.aggrid.maxBlocksInCache,
        }),
        [],
    );

    return (
        <Box>
            <GlobalStyles styles={getGlobalStyles()} />
            <AgGridReact<any>
                columnDefs={columns}
                defaultColDef={defaultColDef}
                modules={[ServerSideRowModelModule, ColumnsToolPanelModule, MenuModule, SetFilterModule]}
                className="ag-theme-material"
                domLayout="autoHeight"
                rowHeight={environment.aggrid.rowHeight}
                sideBar={sideBar}
                containerStyle={{ width: '100%', fontFamily: 'Assistant', fontSize: '1rem' }}
                components={{ agDateInput: DateFilterComponent }}
                localeText={i18next.t('agGridLocaleText', { returnObjects: true }) as Record<string, string>}
                pagination
                paginationPageSize={environment.aggrid.paginationPageSize}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...rowModelProps}
                animateRows
                enableRtl
                enableCellTextSelection
                suppressCellFocus
                suppressDragLeaveHidesColumns
            />
        </Box>
    );
};

export default ActivityLogPage;
