/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-props-no-spreading */
import { Check } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { Badge, Box, IconButton } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteElement, SelectElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { AreasService } from '../../../services/areas';
import { BuildingsService } from '../../../services/buildings';
import { FloorsService } from '../../../services/floors';
import { UsersService } from '../../../services/users';
import { useUserStore } from '../../../stores/user';
import { requiredString, yupRequire } from '../../../utils/yup';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';
import ImportManyButton from './importManyButton';
import InfoExcel from './info/infoExcel';
import { tableCategories, tableExampleData } from './info/tableData';

export enum ResourceTypes {
    AREA = 'area',
    BUILDING = 'building',
    FLOOR = 'floor',
    ROOM = 'room',
}

const importResourcesSchema = yup.object({
    baseId: requiredString,
    areaId: yup
        .string()
        .when('resourceToImport', {
            is: (a: ResourceTypes) => [ResourceTypes.BUILDING, ResourceTypes.FLOOR, ResourceTypes.ROOM].includes(a),
            then: yupRequire,
        })
        .nullable(),
    buildingId: yup
        .string()
        .when('resourceToImport', { is: (a: ResourceTypes) => [ResourceTypes.FLOOR, ResourceTypes.ROOM].includes(a), then: yupRequire })
        .nullable(),
    floorId: yup.string().when('resourceToImport', { is: ResourceTypes.ROOM, then: yupRequire }).nullable(),
});

interface IImportResourcesProps {
    resourceType: ResourceTypes;
}

const ImportResources = (props: IImportResourcesProps) => {
    const { resourceType } = props;

    const { watch, setValue } = useFormContext();

    const currentUser = useUserStore(({ user }) => user);

    const [excelData, setExcelData] = useState<(string | boolean)[][]>([]);

    const selectedAreaId: string | undefined = watch('areaId');
    const selectedBuildingId: string | undefined = watch('buildingId');
    const selectedBaseId: string | undefined = watch('baseId');

    const [{ data: bases = [] }, { data: areas = [] }, { data: buildings = [] }, { data: floors = [] }] = useQueries({
        queries: [
            {
                queryKey: ['bases', currentUser.genesisId],
                queryFn: async () => {
                    const { bases: currentUserBases } = await UsersService.getUserPermissions(currentUser.genesisId);
                    return currentUserBases;
                },
            },
            {
                queryKey: ['areas', selectedBaseId, currentUser.baseId],
                queryFn: () => AreasService.getByQuery({ baseId: selectedBaseId || currentUser.baseId }),
                enabled: !!selectedBaseId || !!currentUser.baseId,
            },
            {
                queryKey: ['buildings', selectedAreaId],
                queryFn: () => BuildingsService.getByQuery({ areaId: selectedAreaId }),
                enabled: !!selectedAreaId,
            },
            {
                queryKey: ['floors', selectedBuildingId],
                queryFn: () => FloorsService.getByQuery({ buildingId: selectedBuildingId }),
                enabled: !!selectedBuildingId,
            },
        ],
    });

    // * this is for the info button
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [tableCategory, setTableCategory] = useState<string[]>([]);
    const [tableExampleRows, setExampleTableRows] = useState<string[][]>([]);

    const getDisplayData = () => {
        setTableCategory(resourceType ? tableCategories[resourceType] : []);
        setExampleTableRows(resourceType ? tableExampleData[resourceType] : []);
    };

    const getSelectElement = (
        name: string,
        label: string,
        options: { id: string; label: string }[],
        required: boolean,
        disabled: boolean = false,
    ) => <SelectElement name={name} label={label} options={options} required={required} disabled={disabled} />;

    const getAutocompleteElement = (
        name: string,
        label: string,
        options: { id: string; label: string }[],
        required: boolean,
        disabled: boolean = false,
    ) => <AutocompleteElement name={name} label={label} options={options} required={required} autocompleteProps={{ disabled }} matchId />;

    const getBaseSelection = (disabled?: boolean) =>
        getSelectElement(
            'baseId',
            i18next.t('common.base'),
            bases.map(({ _id: id, name: label }) => ({ id, label })),
            true,
            disabled,
        );

    const getAreaSelection = (disabled?: boolean) =>
        getAutocompleteElement(
            'areaId',
            i18next.t('common.area'),
            areas.map((area) => ({ id: area._id, label: area.name })),
            true,
            disabled,
        );

    const getBuildingSelection = (disabled?: boolean) =>
        getAutocompleteElement(
            'buildingId',
            i18next.t('common.building'),
            buildings.map((building) => ({ id: building._id, label: building.name })),
            true,
            disabled,
        );

    const getFloorSelection = (disabled?: boolean) =>
        getSelectElement(
            'floorId',
            i18next.t('common.floor'),
            floors
                .map(({ _id: id, floorNumber }) => ({ id, label: String(floorNumber) }))
                .sort(({ label: firstLabel }, { label: secondLabel }) => (firstLabel > secondLabel ? 1 : -1)),
            true,
            disabled,
        );

    const createModalBySelectedTypeOfResource = () => {
        switch (resourceType) {
            case ResourceTypes.AREA:
                return <>{getBaseSelection()}</>;
            case ResourceTypes.BUILDING:
                return (
                    <>
                        {getBaseSelection()}
                        {getAreaSelection(!selectedBaseId)}
                    </>
                );
            case ResourceTypes.FLOOR:
                return (
                    <>
                        {getBaseSelection()}
                        {getAreaSelection(!selectedBaseId)}
                        {getBuildingSelection(!selectedAreaId)}
                    </>
                );
            case ResourceTypes.ROOM:
                return (
                    <>
                        {getBaseSelection()}
                        {getAreaSelection(!selectedBaseId)}
                        {getBuildingSelection(!selectedAreaId)}
                        {getFloorSelection(!selectedBuildingId)}
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        setValue('currentBaseId', currentUser.baseId);
        setValue('resourceToImport', resourceType);
    }, []);

    useEffect(() => setValue('excelData', excelData), [excelData]);

    useEffect(() => {
        getDisplayData();
        setExcelData([]);
    }, [resourceType]);

    return (
        <>
            <GridWrapper container>
                {createModalBySelectedTypeOfResource()}
                {resourceType && (
                    <GridWithMultipleItems container>
                        <Badge
                            badgeContent={<Check />}
                            color="primary"
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            invisible={!excelData.length}
                        >
                            <ImportManyButton resourceType={resourceType} setData={setExcelData} />
                        </Badge>

                        <Box>
                            <IconButton onClick={() => setOpenInfo(true)}>
                                <InfoIcon />
                            </IconButton>
                        </Box>
                    </GridWithMultipleItems>
                )}
            </GridWrapper>
            {openInfo && (
                <InfoExcel open={openInfo} handleClose={() => setOpenInfo(false)} tableCategories={tableCategory} tableRows={tableExampleRows} />
            )}
        </>
    );
};

export { ImportResources, importResourcesSchema };
