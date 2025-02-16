/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Done as DoneIcon } from '@mui/icons-material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useQuery } from '@tanstack/react-query';
import { styleData, styleNoData } from './style';
import FilterTitle from '../filterTitle';
import { BasesService } from '../../../services/bases';

interface IBaseFilterProps {
    setFilter: (newValue: any) => void;
    currentBase: string | null;
}

const BaseFilter = ({ setFilter, currentBase }: IBaseFilterProps) => {
    const { data: bases } = useQuery({ queryKey: ['bases'], queryFn: () => BasesService.getByQuery(), initialData: [] });

    const handleChange = (newValue: string | null) => {
        const filterValue = newValue === currentBase ? undefined : newValue;
        setFilter((curr: {}) => ({ ...curr, ...{ baseId: filterValue } }));
    };

    return (
        <Grid container>
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                    <FilterTitle disabled={!currentBase} resetFilter={() => handleChange(null)} title="common.base" />
                </AccordionSummary>
                <AccordionDetails sx={bases.length ? styleData : styleNoData}>
                    <Grid container spacing={1}>
                        {bases.length ? (
                            bases.map(({ _id, name }) => (
                                <Grid item key={_id}>
                                    <Chip
                                        onClick={() => handleChange(_id)}
                                        icon={currentBase === _id ? <DoneIcon /> : <HomeWorkIcon />}
                                        color={currentBase === _id ? 'primary' : undefined}
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

export default BaseFilter;
