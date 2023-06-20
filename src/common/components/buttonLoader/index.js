import React from 'react';
// import Spinner from 'react-bootstrap/Spinner';

export default function ButtonLoader(props) {
    return (
        props.loading ?
            <div className="d-flex align-items-center justify-content-center" style={{ padding: props.padding ? props.padding : null }}>
                <div className="spinner-grow" role="status" style={{ height: '0.5rem', width: '0.5rem' }}>
                    <span className="sr-only">...</span>
                </div>
            </div>
            : null
    )
}