/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { FilterAltOff } from '@mui/icons-material';
import FilterList from '@mui/icons-material/FilterList';
import { Button, Grid, Popover } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { environment } from '../../../globals';
import { IconButtonWithTooltip } from '../../IconButtonWithTooltip';
import { SortDate } from '../SortDate';
import BranchFilter from '../filterTypes/branchFilter';
import NetworksFilter from '../filterTypes/networksFilter';
import ResourceFilter from '../filterTypes/resourceFilter';
import ViewModeFilter from '../filterTypes/viewModeFilter';

interface IFacilitiesFilterProps {
    setFilter: (filterBy: any) => any;
    initFilters: () => any;
    facilities: { name: string; _id: string }[];
    filter: any;
}

const FacilitiesFilter = (props: IFacilitiesFilterProps) => {
    const { facilities, setFilter, filter, initFilters } = props;

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleFilterClose = () => setAnchorEl(null);

    return (
        <>
            <Grid container direction="row" wrap="nowrap" alignItems="center" spacing={4}>
                <Grid item>
                    <Button
                        variant="contained"
                        sx={{
                            color: '#727272',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '10px',
                            boxShadow: '0px 3px 6px #00000029',
                            ':hover': {
                                backgroundColor: '#EFEFEF',
                            },
                            width: '100%',
                        }}
                        endIcon={<FilterList />}
                        onClick={handleFilterOpen}
                    >
                        {i18next.t('filters.title')}
                    </Button>
                </Grid>
                <Grid item>
                    <SortDate filter={filter} setFilter={setFilter} hasEndDate defaultRangeInDays={environment.defaultRangeInDays} />
                </Grid>
            </Grid>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                TransitionProps={{
                    style: { boxShadow: '0px 3px 8px 2px rgba(0,0,0,0.12)' },
                }}
            >
                <Grid sx={{ right: '0', position: 'absolute', margin: '1rem' }}>
                    <IconButtonWithTooltip iconButtonProps={{ onClick: initFilters }} popoverText={i18next.t('resources.resetFilters')}>
                        <FilterAltOff fontSize="medium" />
                    </IconButtonWithTooltip>
                </Grid>
                <Grid
                    container
                    rowSpacing={1}
                    direction="column"
                    wrap="nowrap"
                    justifyContent="start"
                    sx={{ margin: '1rem', width: '25rem', maxHeight: '30rem' }}
                >
                    <Grid item>
                        <ViewModeFilter setFilter={setFilter} currentViewMode={filter.viewMode!} />
                    </Grid>
                    <Grid item>
                        <ResourceFilter setFilter={setFilter} currentResource={filter?.roomId ?? null} resources={facilities} />
                    </Grid>
                    <Grid item>
                        <NetworksFilter setFilter={setFilter} currentNetworks={filter.networks} />
                    </Grid>
                    <Grid item>
                        <BranchFilter setFilter={setFilter} currentBranch={filter.branchId} />
                    </Grid>
                </Grid>
            </Popover>
        </>
    );
};

export default FacilitiesFilter;
