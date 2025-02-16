/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import i18next from 'i18next';
import { Task, ViewMode } from '../../types/public-types';
import styles from './task-list-table.module.css';

export const TaskListTableDefault: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    viewMode: ViewMode;
}> = ({ viewMode, rowHeight, rowWidth, tasks, fontFamily, fontSize, onExpanderClick }) => {
    // this functions removes any duplicate titles.
    // the tasks come divided from the backend, thus, it seems like diff tasks. but some of them are the same
    // task divided into subtasks. thus, need to filter duplicates.
    const noDuplicateTasks = tasks.filter((object, index, self) => index === self.findIndex((o) => o.bedroomId === object.bedroomId));

    return (
        <div
            className={styles.taskListWrapper}
            style={{
                fontFamily,
                fontSize,
                width: Number(rowWidth) * 2 + 17,
            }} // TODO CHANGE 17
        >
            {noDuplicateTasks.map((t, index) => {
                let expanderSymbol = '';
                if (t.hideChildren === false) {
                    expanderSymbol = '▼';
                } else if (t.hideChildren === true) {
                    expanderSymbol = '▶';
                }

                return (
                    <div
                        className={styles.taskListTableRow}
                        style={{ height: rowHeight, display: 'flex', flexDirection: 'column', paddingRight: '1rem', paddingTop: '1.5rem' }}
                        key={index}
                    >
                        {/* IF I WANT TO CHANGE TASK LIST WITH HERE */}
                        <div
                            className={styles.taskListCell}
                            style={{
                                minWidth: Number(rowWidth) * 2,
                                maxWidth: rowWidth,
                            }}
                            title={t.title}
                        />
                        <div className={styles.taskListNameWrapper}>{t.title}</div>
                        <div
                            className={styles.taskListCell}
                            style={{
                                minWidth: rowWidth,
                                maxWidth: rowWidth,
                            }}
                        >
                            <div className={styles.taskVerticalAlign}>
                                <div> {t.branch} </div>
                                {t.location ? (
                                    <>
                                        <div style={{ paddingLeft: '5px' }}> {i18next.t('bedroomsGantt.building')} </div>
                                        <div>{`${t.building},`}</div>
                                        <div style={{ paddingRight: '5px', paddingLeft: '5px' }}> {i18next.t('bedroomsGantt.floor')} </div>
                                        <div>{t.floor}</div>
                                    </>
                                ) : (
                                    <div>{t.child}</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            {noDuplicateTasks.length < 6 &&
                new Array(6 - noDuplicateTasks.length)
                    .fill(noDuplicateTasks.length)
                    .map((el, i) => el + i)
                    .map((t, index) => (
                        <div
                            className={styles.taskListTableRow}
                            style={{
                                height: viewMode === ViewMode.Month ? (rowHeight * 5.8) / 5 : rowHeight,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            key={index}
                        />
                    ))}
        </div>
    );
};
