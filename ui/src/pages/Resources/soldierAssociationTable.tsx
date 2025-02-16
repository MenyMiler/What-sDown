/* eslint-disable react/jsx-props-no-spreading */
import { ColDef } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { Box, Button, FormHelperText, GlobalStyles, Typography } from '@mui/material';
import { ColumnsToolPanelModule } from '@noam7700/ag-grid-enterprise-column-tool-panel';
import { MenuModule } from '@noam7700/ag-grid-enterprise-menu';
import { ServerSideRowModelModule } from '@noam7700/ag-grid-enterprise-server-side-row-model';
import i18next from 'i18next';
import React, { ComponentProps, useEffect, useMemo, useRef, useState } from 'react';
import DatePickerField from '../../common/DatePicker';
import { environment } from '../../globals';
import { RoomOccupationType } from '../../interfaces/roomInCourse';
import type { agGridRequest } from '../../utils/agGrid';
import { DateFilterComponent } from '../../utils/agGrid/DateFilterComponent';
import { agGridResponse, createDataSource, defaultColDef, sideBar } from '../../utils/agGrid/index';
import { SoldierAssociation, SoldierTypes } from '../../interfaces/soldier';
import { RoomTypes } from '../../interfaces/room';

interface props {
    resourceId: string;
    getSoldierAssociations: (
        agGridRequest: agGridRequest & {
            id: string;
        },
    ) => Promise<agGridResponse<any>>;
}

const SoldierAssociationTable = ({ resourceId, getSoldierAssociations }: props) => {
    const {
        aggrid: { rowHeight, paginationPageSize, maxBlocksInCache },
    } = environment;

    const [error, setError] = useState('');

    const columnDefs: ColDef<any>[] = [
        {
            headerName: i18next.t('common.type'),
            field: 'trainingType',
            filter: 'agSetColumnFilter',
            filterParams: {
                suppressMiniFilter: true,
                values: Object.keys(SoldierAssociation),
                valueFormatter: ({ value }: { value: SoldierAssociation }) => i18next.t(`resources.associationType.${value}`),
            },
            valueFormatter: ({ value }) => i18next.t(`resources.associationType.${value}`),
        },
        { headerName: i18next.t('resources.associationName'), field: 'trainingName', filter: 'agTextColumnFilter' },

        {
            headerName: i18next.t('newEditResourcesPage.name'),
            field: 'roomData',
            valueFormatter: ({ value }) =>
                value
                    .map((item: any) => `${item.formattedRoom}, ${i18next.t('resources.type')}: ${i18next.t(`common.roomTypes.${item.type}`)}`)
                    .join('\n'),
            cellStyle: { whiteSpace: 'pre-line', lineHeight: '1.5em' },
            autoHeight: true,
            minWidth: 250,
            tooltipValueGetter: ({ value }) =>
                value
                    .map((item: any) => `${item.formattedRoom}, ${i18next.t('resources.type')}: ${i18next.t(`common.roomTypes.${item.type}`)}`)
                    .join(' , '),
            filter: 'agTextColumnFilter',
        },
        {
            headerName: i18next.t('resources.associationStartDate'),
            field: 'startDate',
            cellRenderer: (data: { value: string }) => (data.value ? new Date(data.value).toLocaleDateString('en-GB') : ''),
            filter: 'agDateColumnFilter',
        },
        {
            headerName: i18next.t('resources.associationEndDate'),
            field: 'endDate',
            cellRenderer: (data: { value: string }) => (data.value ? new Date(data.value).toLocaleDateString('en-GB') : ''),
            filter: 'agDateColumnFilter',
        },

        {
            headerName: i18next.t('common.soldierType'),
            field: 'soldierType',
            filter: 'agSetColumnFilter',
            filterParams: {
                suppressMiniFilter: true,
                values: Object.values(SoldierTypes),
                valueFormatter: ({ value }: { value: SoldierTypes }) => i18next.t(`resources.soldierType.${value}`),
            },
            valueFormatter: ({ value }) => i18next.t(`resources.soldierType.${value}`),
        },
    ];

    const gridRef = useRef<AgGridReact>(null);

    const getGlobalStyles = () => ({
        '.ag-column-select-virtual-list-viewport': { height: `${rowHeight * paginationPageSize}px !important` },
        '.ag-center-cols-clipper': { minHeight: `${rowHeight * paginationPageSize}px !important` },
    });

    const rowModelProps = useMemo<ComponentProps<typeof AgGridReact>>(
        () => ({
            rowModelType: 'serverSide',
            serverSideDatasource: createDataSource((agGridRequest) => getSoldierAssociations({ ...agGridRequest, id: resourceId })),
            cacheBlockSize: paginationPageSize,
            maxBlocksInCache,
        }),
        [resourceId],
    );

    return (
        <>
            <Box sx={{ marginLeft: 4, marginBottom: 1 }}>
                <FormHelperText error={!!error}>{error}</FormHelperText>
            </Box>
            <GlobalStyles styles={getGlobalStyles()} />
            <AgGridReact<any>
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                modules={[ServerSideRowModelModule, ColumnsToolPanelModule, MenuModule]}
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
                rowModelType="serverSide"
            />
        </>
    );
};

export default SoldierAssociationTable;
