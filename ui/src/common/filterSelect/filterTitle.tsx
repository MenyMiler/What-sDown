/* eslint-disable jsx-a11y/anchor-is-valid */
import { Chip, Grid, Link } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { styleActiveLink, styleDisableLink } from './filterTypes/style';

interface IFilterTitleProps {
    disabled: boolean;
    resetFilter: () => void;
    title: string;
}

const FilterTitle = ({ resetFilter, disabled, title }: IFilterTitleProps) => {
    return (
        <Grid container alignItems="center">
            <Grid>
                <Chip color="primary" size="small" label={i18next.t(title)} variant="filled" />
            </Grid>
            <Grid item sx={{ ml: '1rem' }}>
                <Link
                    disabled={disabled}
                    sx={{ ...(disabled ? styleDisableLink : styleActiveLink) }}
                    component="button"
                    variant="overline"
                    underline={disabled ? 'none' : 'always'}
                    onClick={resetFilter}
                >
                    {i18next.t('filters.reset')}
                </Link>
            </Grid>
        </Grid>
    );
};

export default FilterTitle;
