import React from 'react';

export default function Loader({ isLoading }) {
    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    else return null
}