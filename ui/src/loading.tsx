import React from 'react';
import './css/loading.scss';

const Loading: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="loading-text">
                <span>N</span>
                <span>A</span>
                <span>L</span>
                <span>P</span>
                <span>L</span>
                <span>L</span>
                <span>U</span>
                <span>F</span>
            </div>
        </div>
    );
};

export default Loading;
