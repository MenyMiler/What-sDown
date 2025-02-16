/* eslint-disable react/require-default-props */
import { Alert, Button, Snackbar } from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { RequestTypes } from '../../interfaces/request';
import { LocalStorage } from '../../utils/localStorage';
import { setValues } from '../../utils/wizard';

interface ISnackBarProps {
    requestType: RequestTypes | string;
    setDisplaySavedData?: Dispatch<SetStateAction<boolean>>;
    isNextSteps?: boolean;
}

const SnackBar = ({ setDisplaySavedData, requestType, isNextSteps }: ISnackBarProps) => {
    const { watch, setValue } = useFormContext();
    const formValues = watch();
    const [open, setOpen] = useState(false);
    const [isSavedInputValues, setIsSavedInputValues] = useState<boolean>(false);
    const [savedInputValues, setSavedInputValues] = useState<{
        [key: string]: any;
    }>({});
    const [accumulatorData, setAccumulatorData] = useState<FieldValues>({});

    useEffect(() => {
        const inputValues = LocalStorage.get(requestType, '');
        if (inputValues) {
            setSavedInputValues(JSON.parse(inputValues));
            if (!isNextSteps) setOpen(true);
        }
    }, []);

    useEffect(() => {
        const isDefinedField =
            requestType === RequestTypes.TRANSFER_SOLDIERS_AMOUNT
                ? Object.values(formValues).some((value) => value && Object.values(value).some((gender) => !!gender))
                : Object.values(formValues).some((value) => (requestType === RequestTypes.NEW_COURSE ? value !== undefined : !!value));
        if (isDefinedField && !_.isEqual(formValues, accumulatorData)) {
            LocalStorage.set(requestType, JSON.stringify({ ...formValues, isSavedInputValues }));
            setAccumulatorData(formValues);
        } else if (!LocalStorage.get(requestType, '')) localStorage.removeItem(requestType);
    });

    const getLocalStorage = async () => {
        setOpen(false);
        setIsSavedInputValues(true);
        if (setDisplaySavedData) setDisplaySavedData(true);
        setValues(savedInputValues, setValue);
    };

    const deleteLocalStorage = () => {
        localStorage.removeItem(requestType);
        setOpen(false);
    };

    useEffect(() => {
        if (isNextSteps && savedInputValues.isSavedInputValues) getLocalStorage();
    }, []);

    return (
        <Snackbar sx={{ width: '100%' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={open} onClose={() => setOpen(false)}>
            <Alert
                severity="info"
                action={
                    <>
                        <Button onClick={deleteLocalStorage}>{i18next.t('areYouSureDialog.no')}</Button>
                        <Button onClick={getLocalStorage}>{i18next.t('areYouSureDialog.yes')}</Button>
                    </>
                }
            >
                {i18next.t('wizard.continueWhereYouLeftOff')}
            </Alert>
        </Snackbar>
    );
};

export default SnackBar;
