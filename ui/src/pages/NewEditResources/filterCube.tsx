/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, Box, InputAdornment, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { ResourcesTypes } from './extendedCube';
import { SortTypes } from '../../common/resources/sorts.types';
import { BasesService } from '../../services/bases';
import { AreasService } from '../../services/areas';
import { useUserStore } from '../../stores/user';
import { Genders } from '../../interfaces/room';

interface FilterCubeProps {
    resourceType: ResourcesTypes;
    setSort: (sortType: SortTypes, value: string | string[] | undefined) => void;
}

const FilterCube = ({ resourceType, setSort }: FilterCubeProps) => {
    const baseId = useUserStore(({ user }) => user.baseId);
    const [selectedNetworks, setSelectedNetworks] = useState<{ value: string; label: string }[]>([]);
    const [buildings, setBuildings] = useState<{ _id: string; name: string }[]>([]);
    const [areas, setAreas] = useState<{ _id: string; name: string }[]>([]);
    const [networks, setNetworks] = useState<{ _id: string; label: string }[]>([]);
    const [branches, setBranches] = useState<{ _id: string; name: string }[]>([]);

    const genders = Object.values(Genders).map((gender) => ({ _id: gender, name: i18next.t(`common.genders.${gender}`) }));

    const getSorts = async (): Promise<void> => {
        try {
            const [buildingsData, areasData, networksData, branchesData] = await Promise.all([
                BasesService.getBuildings(baseId),
                AreasService.getByQuery({ baseId }),
                BasesService.getNetworks(baseId),
                BasesService.getBranches(baseId),
            ]);

            setBuildings(
                buildingsData.map(({ _id, name }) => ({ _id, name })), // Ensure objects are properly mapped
            );
            setAreas(areasData.map(({ _id, name }) => ({ _id, name })));
            setNetworks(networksData.map(({ _id, name }) => ({ _id, label: name })));
            setBranches(branchesData.map(({ _id, name }) => ({ _id, name })));
        } catch (error) {
            toast.error('Error fetching sorts');
        }
    };

    useEffect(() => {
        getSorts();
    }, [baseId]);

    const handleChange = (event: any, selectedOptions: { label: string; value: string }[]) => {
        if (selectedOptions.length <= 3) {
            setSelectedNetworks(selectedOptions);
            setSort(
                SortTypes.NETWORKS,
                selectedOptions.map(({ value }) => value),
            );
        } else {
            toast.error(i18next.t('newEditResourcesPage.errors.tooMuchNetworks'));
        }
    };

    const getRelevantFilters = () => {
        switch (resourceType) {
            case ResourcesTypes.CLASS:
            case ResourcesTypes.OFFICE:
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        justifyContent="space-between"
                        width="20rem"
                        my="0.15rem"
                        mb="0.75rem"
                    >
                        <Box display="flex" alignItems="center" flexDirection="row" justifyContent="space-between" width="20rem" my="0.75rem">
                            <Autocomplete
                                disablePortal
                                options={branches}
                                getOptionLabel={(option) => option.name}
                                size="small"
                                onChange={(event, value) => setSort(SortTypes.BRANCH, value?._id)}
                                sx={{ width: '9.5rem' }}
                                renderInput={(params) => <TextField {...params} label={i18next.t('newEditResourcesPage.branch')} />}
                            />
                            <Autocomplete
                                disablePortal
                                options={areas}
                                getOptionLabel={(option) => option.name}
                                size="small"
                                sx={{ width: '9.5rem' }}
                                onChange={(event, value) => setSort(SortTypes.AREA, value?._id)}
                                renderInput={(params) => <TextField {...params} label={i18next.t('newEditResourcesPage.area')} />}
                            />
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            flexDirection="row"
                            justifyContent="space-between"
                            whiteSpace="nowrap"
                            width="20rem"
                            my="0.15rem"
                        >
                            <Autocomplete
                                multiple
                                disablePortal
                                disableCloseOnSelect
                                options={networks.map(({ _id, label }) => ({ label, value: _id }))}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                size="small"
                                value={selectedNetworks}
                                onChange={handleChange}
                                sx={{ width: '20rem' }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={i18next.t('newEditResourcesPage.networks')}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                            },
                                        }}
                                    />
                                )}
                                ChipProps={{
                                    sx: {
                                        fontSize: '0.75rem', // Smaller chip text
                                        height: '2rem', // Adjust chip height
                                        margin: '0 2px', // Add spacing between chips
                                        '.MuiChip-label': {
                                            padding: '0 6px', // Adjust chip padding
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                );
            case ResourcesTypes.SOLDIER_BEDROOM:
            case ResourcesTypes.STAFF_BEDROOM:
            default:
                return (
                    <Box display="flex" alignItems="center" flexDirection="row" justifyContent="space-between" width="20rem" my="0.75rem">
                        <Autocomplete
                            disablePortal
                            options={buildings}
                            getOptionLabel={(option) => option.name}
                            size="small"
                            sx={{ maxWidth: '5.5rem' }}
                            onChange={(event, value) => setSort(SortTypes.BUILDING, value?._id)}
                            renderInput={(params) => <TextField {...params} label={i18next.t('newEditResourcesPage.building')} />}
                        />
                        <Autocomplete
                            disablePortal
                            options={areas}
                            getOptionLabel={(option) => option.name}
                            size="small"
                            sx={{ maxWidth: '5.5rem', mx: '1.5rem' }}
                            onChange={(event, value) => setSort(SortTypes.AREA, value?._id)}
                            renderInput={(params) => <TextField {...params} label={i18next.t('newEditResourcesPage.area')} />}
                        />
                        <Autocomplete
                            disablePortal
                            options={genders}
                            getOptionLabel={(option) => option.name}
                            size="small"
                            sx={{ maxWidth: '5.5rem' }}
                            onChange={(event, value) => setSort(SortTypes.GENDER, value?._id)}
                            renderInput={(params) => <TextField {...params} label={i18next.t('newEditResourcesPage.gender')} />}
                        />
                    </Box>
                );
        }
    };

    return (
        <Box display="flex" alignItems="center" flexDirection="column" justifyContent="space-between" width="20rem" mt="0.5rem">
            <Box>
                <TextField
                    size="small"
                    onChange={(event) => setSort(SortTypes.NAME, event.target.value)}
                    label={i18next.t('newEditResourcesPage.search')}
                    InputProps={{
                        size: 'small',
                        sx: { width: '20rem' },
                        endAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            {getRelevantFilters()}
        </Box>
    );
};

export default FilterCube;
