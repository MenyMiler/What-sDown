import { ColDef, IServerSideDatasource, IServerSideGetRowsParams, IServerSideGetRowsRequest, SideBarDef } from '@ag-grid-community/core';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import { Field } from '../../pages/Resources/ResourceTabs/Field';

export const defaultColDef: ColDef = {
    filterParams: { suppressAndOrCondition: true, buttons: ['reset'] },
    sortable: true,
    filter: true,
    menuTabs: ['filterMenuTab'],
    minWidth: 200,
    resizable: true,
    flex: 1,
};

export const sideBar: SideBarDef = {
    toolPanels: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: { suppressRowGroups: true, suppressValues: true, suppressPivotMode: true },
        },
    ],
    position: 'left',
};

export type agGridRequest = Pick<IServerSideGetRowsRequest, 'startRow' | 'endRow' | 'sortModel' | 'filterModel'>;

export type agGridResponse<T = any> = { rows: T[]; lastRowIndex: number };

export type searchFunction = (agGridRequest: agGridRequest) => Promise<agGridResponse>;

export const createDataSource = <Data extends any = Field>(fetchResources: searchFunction): IServerSideDatasource => ({
    getRows: async (params: IServerSideGetRowsParams<Data>) => {
        const { startRow, endRow, sortModel, filterModel } = params.request;

        try {
            const { rows, lastRowIndex } = await fetchResources({ startRow, endRow, sortModel, filterModel });
            params.success({ rowData: rows, rowCount: lastRowIndex });
        } catch (error) {
            toast.error(i18next.t('table.failedToLoadData'));
            params.fail();
        }
    },
});
