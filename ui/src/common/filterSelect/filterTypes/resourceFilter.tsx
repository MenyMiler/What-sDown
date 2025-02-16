/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Done as DoneIcon } from '@mui/icons-material';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import { styleData, styleNoData } from './style';
import FilterTitle from '../filterTitle';

interface IResourceFilter {
    setFilter: (newValue: any) => void;
    currentResource: string | undefined;
    resources: { name: string; _id: string }[];
}

const ResourceFilter = ({ setFilter, currentResource, resources }: IResourceFilter) => {
    const handleChange = (newValue: string | null) => {
        const filterValue = newValue === currentResource ? undefined : newValue;
        setFilter((curr: {}) => ({ ...curr, ...{ roomId: filterValue } }));
    };

    return (
        <Grid container>
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                    <FilterTitle disabled={!currentResource} resetFilter={() => handleChange(null)} title="filterGantt.resourceName" />
                </AccordionSummary>
                <AccordionDetails sx={{ ...(resources.length ? styleData : styleNoData) }}>
                    <Grid container spacing={1}>
                        {resources.length ? (
                            resources.map(({ name, _id }) => (
                                <Grid item key={_id}>
                                    <Chip
                                        onClick={() => handleChange(_id)}
                                        icon={currentResource === _id ? <DoneIcon /> : <DoorBackIcon />}
                                        color={currentResource === _id ? 'primary' : undefined}
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

export default ResourceFilter;
