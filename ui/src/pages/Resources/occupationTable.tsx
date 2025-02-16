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

interface props {
    resourceId: string;
    getOccupation: (
        agGridRequest: agGridRequest & {
            id: string;
            overlapStartDate: Date | null;
            overlapEndDate: Date | null;
        },
    ) => Promise<agGridResponse<any>>;
}

const OccupationTable = ({ resourceId, getOccupation }: props) => {
    const {
        aggrid: { rowHeight, paginationPageSize, maxBlocksInCache },
    } = environment;

    const [checkOverlap, setCheckOverlap] = useState(false);
    const [overlapStartDate, setOverlapStartDate] = useState<Date | null>(null);
    const [overlapEndDate, setOverlapEndDate] = useState<Date | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (overlapStartDate && overlapEndDate && overlapStartDate > overlapEndDate) setError(i18next.t('resources.occupationDateError'));
        else setError('');

        setCheckOverlap(!!overlapStartDate || !!overlapEndDate);
    }, [overlapEndDate, overlapStartDate]);

    const columnDefs: ColDef<any>[] = [
        {
            headerName: i18next.t('resources.type'),
            field: 'type',
            filter: 'agSetColumnFilter',
            filterParams: {
                values: Object.values(RoomOccupationType),
                valueFormatter: (x: { value: RoomOccupationType }) => i18next.t(`resources.occupationType.${x.value}`),
            },
            valueGetter: (x) => i18next.t(`resources.occupationType.${x.data.type}`),
        },
        { headerName: i18next.t('resources.name'), field: 'name', filter: 'agTextColumnFilter' },
        {
            headerName: i18next.t('resources.startDate'),
            field: 'startDate',
            cellRenderer: (data: { value: string }) => (data.value ? new Date(data.value).toLocaleDateString('en-GB') : ''),
            filter: 'agDateColumnFilter',
        },
        {
            headerName: i18next.t('resources.endDate'),
            field: 'endDate',
            cellRenderer: (data: { value: string }) => (data.value ? new Date(data.value).toLocaleDateString('en-GB') : ''),
            filter: 'agDateColumnFilter',
        },
        {
            headerName: i18next.t('resources.occupation'),
            field: 'occupation',
            filter: 'agNumberColumnFilter',
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
            serverSideDatasource: createDataSource((agGridRequest) =>
                getOccupation({ ...agGridRequest, id: resourceId, overlapStartDate, overlapEndDate }),
            ),
            cacheBlockSize: paginationPageSize,
            maxBlocksInCache,
        }),
        [resourceId, overlapStartDate, overlapEndDate],
    );

    return (
        <>
            <Box sx={{ marginLeft: 4, marginBottom: 1 }}>
                <Typography sx={{ fontSize: '1.3rem' }}>{i18next.t('resources.filterByRange')}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box>
                        <DatePickerField date={overlapStartDate} setDate={setOverlapStartDate} label={i18next.t('resources.startDate')} />
                    </Box>
                    <Box>
                        <DatePickerField date={overlapEndDate} setDate={setOverlapEndDate} label={i18next.t('resources.endDate')} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '0.5vh' }}>
                        <Button
                            onClick={() => {
                                setOverlapStartDate(null);
                                setOverlapEndDate(null);
                            }}
                            disabled={!checkOverlap}
                        >
                            {i18next.t('filters.reset')}
                        </Button>
                    </Box>
                </Box>
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

export default OccupationTable;
