/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Done as DoneIcon } from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useQuery } from '@tanstack/react-query';
import { styleData, styleNoData } from './style';
import FilterTitle from '../filterTitle';
import { BuildingsService } from '../../../services/buildings';
import { useUserStore } from '../../../stores/user';
import { BasesService } from '../../../services/bases';

interface IBuildingFilter {
    setFilter: (newValue: any) => void;
    currentBuilding: string | undefined;
}

const BuildingFilter = ({ setFilter, currentBuilding }: IBuildingFilter) => {
    const currentUser = useUserStore(({ user }) => user);

    const handleChange = (newValue: string | null) => {
        const filterValue = newValue === currentBuilding ? undefined : newValue;
        setFilter((curr: {}) => ({ ...curr, ...{ buildingId: filterValue } }));
    };

    const { data: buildings } = useQuery({
        queryKey: ['buildings', currentUser.baseId!],
        queryFn: () => BasesService.getBuildings(currentUser.baseId!),
        initialData: [],
    });

    return (
        <Grid container>
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                    <FilterTitle disabled={!currentBuilding} resetFilter={() => handleChange(null)} title="filterGantt.building" />
                </AccordionSummary>
                <AccordionDetails sx={{ ...(buildings.length ? styleData : styleNoData) }}>
                    <Grid container spacing={1}>
                        {buildings.length ? (
                            buildings.map(({ name, _id }) => (
                                <Grid item key={_id}>
                                    <Chip
                                        onClick={() => handleChange(_id)}
                                        icon={currentBuilding === _id ? <DoneIcon /> : <ApartmentIcon />}
                                        color={currentBuilding === _id ? 'primary' : undefined}
                                        label={name}
                                        size="small"
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid sx={{ ml: '1rem' }}> {i18next.t('noData')}</Grid>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

export default BuildingFilter;
