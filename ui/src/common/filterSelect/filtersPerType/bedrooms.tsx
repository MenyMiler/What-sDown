/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { FilterAltOff } from '@mui/icons-material';
import FilterAlt from '@mui/icons-material/FilterAlt';
import { Button, Grid, Popover } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { environment } from '../../../globals';
import { IconButtonWithTooltip } from '../../IconButtonWithTooltip';
import { SortDate } from '../SortDate';
import BuildingFilter from '../filterTypes/buildingFilter';
import FloorFilter from '../filterTypes/floorFilter';
import GenderFilter from '../filterTypes/genderFilter';
import OccupationStatusFilter from '../filterTypes/occupationStatusFilter';
import ResourceFilter from '../filterTypes/resourceFilter';
import RoomTypeFilter from '../filterTypes/roomTypeFilter';
import SoldiersFilter from '../filterTypes/soldiersFilter';

interface IBedroomsFilter {
    setFilter: (filterBy: any) => any;
    initFilters: () => any;
    bedrooms: { name: string; _id: string }[];
    filter: any;
    coursesIds: string[];
}

const BedroomsFilter = (props: IBedroomsFilter) => {
    const { bedrooms, setFilter, filter, initFilters, coursesIds } = props;

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
                        endIcon={<FilterAlt />}
                        onClick={handleFilterOpen}
                    >
                        {i18next.t('filters.title')}
                    </Button>
                </Grid>
                <Grid item>
                    <SoldiersFilter setFilter={setFilter} currentSoldier={filter?.soldierId ?? null} coursesIds={coursesIds} />
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
                    {/* <Grid item>
                        <OccupationStatusFilter setFilter={setFilter} currentStatus={filter.occupation!} />
                    </Grid> */}
                    <Grid item>
                        <GenderFilter setFilter={setFilter} currentGender={filter?.gender ?? null} />
                    </Grid>
                    <Grid item>
                        <RoomTypeFilter setFilter={setFilter} currentRoomType={filter?.isStaff ?? null} />
                    </Grid>
                    <Grid item>
                        <ResourceFilter setFilter={setFilter} currentResource={filter?.roomId ?? null} resources={bedrooms} />
                    </Grid>
                    <Grid item>
                        <BuildingFilter setFilter={setFilter} currentBuilding={filter?.buildingId ?? null} />
                    </Grid>
                    <Grid item>
                        <FloorFilter setFilter={setFilter} buildingId={filter?.buildingId} currentFloorId={filter?.floorId ?? null} />
                    </Grid>
                </Grid>
            </Popover>
        </>
    );
};

export default BedroomsFilter;
