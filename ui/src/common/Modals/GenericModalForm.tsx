/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, CircularProgress, Step, StepLabel, Stepper, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../interfaces/request';
import { useUserStore } from '../../stores/user';
import { BackButton, ButtonWrap, ContentWrap, BaseButton as ContinueButton } from './modals.styled';

interface IStep {
    content: any;
    schema: any;
}

export type ArrayWithAtLeastOneStep = {
    0: IStep;
} & Array<IStep>;

export interface IModalContent {
    title: string;
    steps: ArrayWithAtLeastOneStep;
    request: any;
}

interface IGenericModalContentProps extends IModalContent {
    handleClose: () => void;
}

const GenericModalForm = (props: IGenericModalContentProps) => {
    const { title, steps, request, handleClose } = props;
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const currentUser = useUserStore(({ user }) => user);

    const { content, schema } = steps[activeStep];

    const isLastStep = () => activeStep === steps.length - 1;

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            await request({ baseId: currentUser.baseId, requesterId: currentUser.id, userType: currentUser.currentUserType, ...data });
            handleClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async (data: any) => {
        if (isLastStep()) {
            handleSubmit(data);
            return;
        }
        setActiveStep(activeStep + 1);
    };

    const removeLocalStorage = () => {
        const requestType =
            {
                [i18next.t('sideBar.courseManagement.createCourseTemplate')]: RequestTypes.NEW_COURSE_TEMPLATE,
                [i18next.t('sideBar.courseManagement.addInstanceOfCourse')]: RequestTypes.NEW_COURSE,
            }[title] || null;
        if (requestType) localStorage.removeItem(requestType);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
        removeLocalStorage();
    };

    return (
        <Box sx={{ width: '100%' }}>
            {steps.length > 1 && (
                <Stepper activeStep={activeStep} sx={{ mb: '2rem' }}>
                    {steps.map((_label, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Step key={index}>
                            <StepLabel />
                        </Step>
                    ))}
                </Stepper>
            )}
            <FormContainer onSuccess={handleNext} resolver={yupResolver(schema)} mode="onChange">
                <ContentWrap>
                    <Typography fontWeight="bold">{i18next.t(title)}</Typography>
                    <Box sx={{ marginTop: '3rem', width: '75%' }}>{React.createElement(content, {})}</Box>
                </ContentWrap>
                <ButtonWrap>
                    {steps.length > 1 && (
                        <BackButton disabled={!activeStep} onClick={handleBack}>
                            {i18next.t('wizard.back')}
                        </BackButton>
                    )}
                    <ContinueButton type="submit" startIcon={loading && <CircularProgress color="secondary" size={35} />} disabled={loading}>
                        {isLastStep() ? i18next.t('wizard.finish') : i18next.t('wizard.continue')}
                    </ContinueButton>
                </ButtonWrap>
            </FormContainer>
        </Box>
    );
};

export default GenericModalForm;
