/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Done as DoneIcon } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import { styleData } from './style';
import { Types } from '../../../interfaces/courseTemplate';
import FilterTitle from '../filterTitle';

interface ICourseTypeFilterProps {
    setFilter: (newValue: any) => void;
    currentCourseType: string | null | undefined;
}

const CourseTypeFilter = ({ setFilter, currentCourseType }: ICourseTypeFilterProps) => {
    const courseTypes = Object.values(Types);

    const handleChange = (newValue: string | null) => {
        const filterValue = newValue === currentCourseType ? undefined : newValue;
        setFilter((curr: {}) => ({ ...curr, ...{ type: filterValue } }));
    };

    return (
        <Grid container>
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                    <FilterTitle disabled={!currentCourseType} resetFilter={() => handleChange(null)} title="common.type" />
                </AccordionSummary>
                <AccordionDetails sx={{ styleData }}>
                    <Grid container spacing={1}>
                        {courseTypes.map((courseType) => (
                            <Grid item key={courseType}>
                                <Chip
                                    onClick={() => handleChange(courseType)}
                                    icon={currentCourseType === courseType ? <DoneIcon /> : <SchoolIcon />}
                                    color={currentCourseType === courseType ? 'primary' : undefined}
                                    label={i18next.t(`common.types.${courseType}`)}
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

export default CourseTypeFilter;
