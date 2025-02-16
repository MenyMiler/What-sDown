/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Badge, Button, Grid, Link, Popover } from '@mui/material';
import { LocalizationProvider, MonthPicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import i18next from 'i18next';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { styleActiveLink, styleDisableLink } from '../filterTypes/style';

interface IRecruitFilterProps {
    setFilter: (filterBy: any) => any;
    filter: any;
}

const RecruitFilter = ({ setFilter, filter }: IRecruitFilterProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleFilterClose = () => setAnchorEl(null);

    const handleChange = (newDate: Date | null) => {
        setFilter((curr: any) => ({ ...curr, monthValue: newDate || undefined }));
    };

    return (
        <>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Badge
                        badgeContent={format(filter?.monthValue || 0, 'MMMM', { locale: he })}
                        invisible={!filter?.monthValue}
                        color="info"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
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
                            endIcon={<CalendarMonthIcon />}
                            onClick={handleFilterOpen}
                        >
                            {i18next.t('filters.month')}
                        </Button>
                    </Badge>
                </Grid>
                <Grid item>
                    <Link
                        disabled={!filter?.monthValue}
                        component="button"
                        variant="overline"
                        underline={filter?.monthValue ? 'always' : 'none'}
                        onClick={() => handleChange(null)}
                        sx={{ ...(filter?.monthValue ? styleActiveLink : styleDisableLink) }}
                    >
                        {i18next.t('filters.reset')}
                    </Link>
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
                <Grid>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
                        <MonthPicker date={null} onChange={handleChange} />
                    </LocalizationProvider>
                </Grid>
            </Popover>
        </>
    );
};

export default RecruitFilter;
