/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Done as DoneIcon, CellTower } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { styleData } from './style';
import FilterTitle from '../filterTitle';
import { NetworksService } from '../../../services/networks';

interface NetworksFilterProps {
    setFilter: (newValue: any) => void;
    currentNetworks: {};
}

const NetworksFilter = ({ setFilter, currentNetworks }: NetworksFilterProps) => {
    const { data: networks } = useQuery({ queryKey: ['networks'], queryFn: () => NetworksService.getByQuery(), initialData: [] });

    const handleChange = (newValue: string) => {
        let filterValue: any = {};

        if (!Object.keys(currentNetworks ?? []).includes(newValue)) {
            filterValue[newValue!] = 1;
        } else if (newValue && Object.keys(currentNetworks ?? []).includes(newValue)) {
            filterValue = currentNetworks;
            delete filterValue[newValue];
        } else {
            filterValue = currentNetworks ?? {};
            filterValue[newValue!] = 1;
        }

        setFilter((curr: {}) => ({ ...curr, ...{ networks: filterValue } }));
    };

    const resetNetworks = () => setFilter((curr: {}) => ({ ...curr, ...{ networks: {} } }));

    return (
        <Grid container>
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                    <FilterTitle disabled={!Object.keys(currentNetworks ?? []).length} resetFilter={resetNetworks} title="filterGantt.networks" />
                </AccordionSummary>
                <AccordionDetails sx={{ ...styleData }}>
                    <Grid container spacing={1}>
                        {networks.map(({ _id, name }) => (
                            <Grid item key={_id}>
                                <Chip
                                    onClick={() => handleChange(name)}
                                    icon={Object.keys(currentNetworks ?? []).includes(name) ? <DoneIcon /> : <CellTower />}
                                    color={Object.keys(currentNetworks ?? []).includes(name) ? 'primary' : undefined}
                                    label={name}
                                    size="small"
                                />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

export default NetworksFilter;
