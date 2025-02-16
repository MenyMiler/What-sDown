import * as React from 'react';
import CourseSearch from '../../../common/Modals/CourseSearch';

const AutocompleteCourse = () => {
    return (
        <CourseSearch
            isCourse
            size="small"
            sx={{
                borderRadius: '10px',
                background: '#FFFFFF 0% 0% no-repeat padding-box',
                border: ' 1px solid #DBDBDB',
                opacity: '1',
                marginBottom: '1rem',
                width: '20rem',
                mr: '1rem',
            }}
            setDisabledTextFields={() => {}}
            values={{}}
            displaySavedData={false}
        />
    );
};

export default AutocompleteCourse;
