import React from 'react';
import styles from './task-list-header.module.css';

export const TaskListHeaderDefault: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    title: string;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, title }) => {
    return (
        <div
            className={styles.ganttTable}
            style={{
                fontFamily,
                fontSize,
            }}
        >
            <div
                className={styles.ganttTable_Header}
                style={{
                    height: headerHeight - 2,
                }}
            >
                {/* // TODO CHANGE 16 */}
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={{
                        width: Number(rowWidth) * 2 + 16,
                        paddingRight: '1rem',
                        fontWeight: 'bolder',
                        fontSize: '1rem',
                    }}
                >
                    {title}
                </div>
            </div>
        </div>
    );
};
