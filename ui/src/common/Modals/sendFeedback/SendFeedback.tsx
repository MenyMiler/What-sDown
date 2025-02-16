/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-props-no-spreading */
import {
    SentimentDissatisfied,
    SentimentSatisfied,
    SentimentSatisfiedAlt,
    SentimentVeryDissatisfied,
    SentimentVerySatisfied,
} from '@mui/icons-material';
import { Grid, IconContainerProps, Rating, Typography, styled } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { CategoryTypes, UrgencyTypes } from '../../../interfaces/feedback';
import { setValues } from '../../../utils/wizard';
import { requiredString } from '../../../utils/yup';
import SnackBar from '../SnackBar';
import { GridWrapper } from '../modals.styled';

const sendFeedbackSchema = yup.object({
    urgency: requiredString,
    description: requiredString,
    category: requiredString,
    rating: yup.number().typeError(i18next.t('yupErrorMessage.number')).default(5),
});

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
    '.MuiSvgIcon-root': {
        fontSize: '2.5rem',
    },
}));

export const customIcons: {
    [index: string]: {
        icon: React.ReactElement;
        value: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfied color="error" />,
        value: '1',
    },
    2: {
        icon: <SentimentDissatisfied color="error" />,
        value: '2',
    },
    3: {
        icon: <SentimentSatisfied color="warning" />,
        value: '3',
    },
    4: {
        icon: <SentimentSatisfiedAlt color="success" />,
        value: '4',
    },
    5: {
        icon: <SentimentVerySatisfied color="success" />,
        value: '5',
    },
};

const values = {
    rating: 5,
};

const IconContainer = (props: IconContainerProps) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
};

const SendFeedback = () => {
    const { setValue } = useFormContext();

    return (
        <GridWrapper container>
            <SnackBar requestType="sendFeedback" />
            <SelectElement
                name="urgency"
                label={i18next.t('feedback.urgency')}
                options={Object.values(UrgencyTypes).map((type) => ({ id: type, label: i18next.t(`feedback.${type}`) }))}
                required
            />

            <SelectElement
                name="category"
                label={i18next.t('feedback.category')}
                options={Object.values(CategoryTypes).map((type) => ({ id: type, label: i18next.t(`feedback.${type}`) }))}
                required
            />

            <TextFieldElement name="description" label={i18next.t('feedback.description')} required multiline maxRows={5} />

            <Grid container sx={{ direction: 'rtl', alignItems: 'center', justifyContent: 'center' }} gap={3}>
                <Grid item>
                    <StyledRating
                        name="highlight-selected-only"
                        IconContainerComponent={IconContainer}
                        getLabelText={(v: number) => customIcons[v].value}
                        highlightSelectedOnly
                        onChange={(_event, newValue) => {
                            setValues<Partial<typeof values>>(
                                {
                                    rating: newValue ?? 5,
                                },
                                setValue,
                            );
                        }}
                        size="large"
                    />
                </Grid>
                <Grid item>
                    <Typography>:{i18next.t('feedback.rating')}</Typography>
                </Grid>
            </Grid>
        </GridWrapper>
    );
};

export { SendFeedback, sendFeedbackSchema };
