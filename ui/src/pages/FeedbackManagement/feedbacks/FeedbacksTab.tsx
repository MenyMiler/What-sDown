/* eslint-disable react/require-default-props */
/* eslint-disable indent */
import * as React from 'react';
import { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import i18next from 'i18next';
import FeedbacksTable from './FeedbacksTable';
import { FeedbackTypes, PopulatedFeedback } from '../../../interfaces/feedback';

interface IFeedbacksTabProps {
    open?: boolean;
    type: string;
    reRenderAllFlag: boolean;
    setReRenderAllFlag: (value: boolean) => void;
    filters?: any;
    setActiveFeedbacksForExcel?: (value: React.SetStateAction<PopulatedFeedback[]>) => void;
}

const FeedbacksTab = ({ open = false, type, reRenderAllFlag, setReRenderAllFlag, filters = {}, setActiveFeedbacksForExcel }: IFeedbacksTabProps) => {
    const [toggleTabs, setToggleTabs] = useState<boolean>(open);

    return (
        <Box>
            <Accordion expanded={toggleTabs} sx={{ minHeight: '4rem' }}>
                <AccordionSummary
                    onClick={() => {
                        setToggleTabs((curr) => !curr);
                    }}
                    expandIcon={<ExpandMore />}
                >
                    <Typography fontWeight="bold">
                        {i18next.t(`feedbackManagementPage.${type === FeedbackTypes.NORMAL ? 'activeFeedbacks' : 'feedbacksArchive'}`)}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {toggleTabs && (
                        <FeedbacksTable
                            filters={filters}
                            reRenderAllFlag={reRenderAllFlag}
                            setReRenderAllFlag={setReRenderAllFlag}
                            type={type}
                            setActiveFeedbacksForExcel={setActiveFeedbacksForExcel}
                        />
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default FeedbacksTab;
