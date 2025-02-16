/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Done as DoneIcon } from '@mui/icons-material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import * as React from 'react';
import { BasesService } from '../../../services/bases';
import { useUserStore } from '../../../stores/user';
import FilterTitle from '../filterTitle';
import { styleData, styleNoData } from './style';

interface IBranchFilterProps {
    setFilter: (newValue: any) => void;
    currentBranch: string | undefined;
}

const BranchFilter = ({ setFilter, currentBranch: currentBrunch }: IBranchFilterProps) => {
    const currentUser = useUserStore(({ user }) => user);

    const handleChange = (newValue: string | null) => {
        const filterValue = newValue === currentBrunch ? undefined : newValue;
        setFilter((curr: {}) => ({ ...curr, ...{ branchId: filterValue || undefined } }));
    };

    const { data: branches = [] } = useQuery({
        queryKey: ['branches', currentUser.baseId!],
        queryFn: () => BasesService.getBranches(currentUser.baseId),
        meta: { errorMessage: i18next.t('error.config') },
    });

    return (
        <Grid container>
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                    <FilterTitle disabled={!currentBrunch} resetFilter={() => handleChange(null)} title="common.branch" />
                </AccordionSummary>
                <AccordionDetails sx={{ ...(branches.length ? styleData : styleNoData) }}>
                    <Grid container spacing={1}>
                        {branches.length ? (
                            branches.map((branch) => (
                                <Grid item key={branch._id}>
                                    <Chip
                                        onClick={() => handleChange(branch._id)}
                                        icon={currentBrunch === branch._id ? <DoneIcon /> : <AccountTreeIcon />}
                                        color={currentBrunch === branch._id ? 'primary' : undefined}
                                        label={i18next.t(`${branch.name}`)}
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

export default BranchFilter;
