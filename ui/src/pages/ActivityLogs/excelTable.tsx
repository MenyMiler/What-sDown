/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState, useLayoutEffect } from 'react';

interface FilePreview {
    data: Array<Record<string, any>>;
}

const ExcelTable = ({ filePreview }: { filePreview: FilePreview }) => {
    const [tableData, setTableData] = useState<any[][]>([]);
    const [overflowingCells, setOverflowingCells] = useState<boolean[]>([]);

    useEffect(() => {
        if (Array.isArray(filePreview.data) && filePreview.data.length > 0) {
            const headers = Object.keys(filePreview.data[0]);
            const rows = filePreview.data.map((row) => headers.map((header) => row[header] || 'N/A'));
            setTableData([headers, ...rows]);
        } else {
            console.error('Invalid or empty data format:', filePreview.data);
            setTableData([]);
        }
    }, [filePreview.data]);

    const formatDate = (date: string) => new Date(date).toLocaleDateString('he-IL');

    useLayoutEffect(() => {
        if (tableData.length === 0 || !tableData[0]) return;

        const checkOverflow = () => {
            const overflowingStatus = tableData[0].map((_, index) => {
                const cell = document.getElementById(`header-cell-${index}`);
                return cell ? cell.scrollWidth > cell.clientWidth : false;
            });
            setOverflowingCells(overflowingStatus);
        };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [tableData]);

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {tableData.length > 0 ? (
                    <Paper sx={{ p: 3, mb: 3, width: '100%', backgroundColor: '#F3F5FE' }}>
                        <Box sx={{ maxHeight: 500, overflowY: 'auto', mt: 2 }}>
                            <Typography sx={{ marginBottom: '2vh', textAlign: 'center', color: '#474642', fontSize: 'clamp(15px, 1.5vw, 25px)' }}>
                                {i18next.t('activityLogs.metaData.excelData')}
                            </Typography>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="file preview table">
                                    <TableHead>
                                        <TableRow>
                                            {tableData[0].map((header, index) => {
                                                const content = i18next.t(`activityLogs.metaData.${header}`, { defaultValue: header });

                                                return (
                                                    <TableCell
                                                        key={index}
                                                        id={`header-cell-${index}`}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            backgroundColor: '#f5f5f5',
                                                            wordWrap: 'break-word',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                        }}
                                                    >
                                                        {overflowingCells[index] ? (
                                                            <Tooltip title={content}>
                                                                <span>{content}</span>
                                                            </Tooltip>
                                                        ) : (
                                                            <span>{content}</span>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.slice(1).map((row, rowIndex) => (
                                            <TableRow
                                                key={rowIndex}
                                                sx={{
                                                    '&:nth-of-type(even)': {
                                                        backgroundColor: '#f9f9f9',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#e0e0e0',
                                                    },
                                                }}
                                            >
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell
                                                        key={cellIndex}
                                                        sx={{
                                                            wordWrap: 'break-word',
                                                            whiteSpace: 'normal',
                                                            padding: '8px',
                                                            maxWidth: '250px',
                                                        }}
                                                    >
                                                        {typeof cell === 'string' && cell.endsWith('Z') ? formatDate(cell) : cell}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        {i18next.t('activityLogs.excelError', { defaultValue: 'No data available.' })}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default ExcelTable;
