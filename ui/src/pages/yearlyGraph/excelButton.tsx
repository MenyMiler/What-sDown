/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/require-default-props */
import * as React from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { ReactComponent as ExcelIcon } from '../../svgs/excelIcon.svg';

interface IExcelButton {
    uploadFile?: any;
    text?: string;
    saveFile?: any;
    disabled?: boolean;
    loading?: boolean;
}

const ExcelButton = ({ uploadFile, text, saveFile, disabled, loading }: IExcelButton) => {
    return (
        <label htmlFor={uploadFile && !disabled ? 'upload-excel' : ''}>
            <input style={{ display: 'none' }} onChange={uploadFile} id="upload-excel" name="upload-excel" type="file" accept=".xlsx" />
            <Button
                disabled={(!uploadFile && loading) || disabled}
                variant="contained"
                sx={{
                    color: '#727272',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0px 3px 6px #00000029',
                    marginBottom: '1rem',
                    ':hover': {
                        backgroundColor: '#EFEFEF',
                    },
                }}
                onClick={saveFile}
                component="span"
                endIcon={!uploadFile && loading ? <CircularProgress size={30} /> : <ExcelIcon />}
                size="small"
            >
                <Typography sx={{ fontWeight: 'bold' }} variant="button">
                    {text ?? 'Excel'}
                </Typography>
            </Button>
        </label>
    );
};

export default ExcelButton;
