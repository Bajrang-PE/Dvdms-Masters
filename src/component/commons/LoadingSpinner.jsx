import React from 'react'
import './Spinner.css';

const LoadingSpinner = () => {
    return (
        // <div className="spinner-container">
        //     <div className="loading-spinner" />
        // </div>


        //  <div className="loader-wrapper">
        //     <div className="loader">
        //         <span></span>
        //         <span></span>
        //         <span></span>
        //     </div>
        //     <p>Loading...</p>
        // </div>

        //  <div className="orbit-container">
        //     <div className="orbit">
        //         <div className="planet"></div>
        //     </div>
        //     <span>Loading...</span>
        // </div>

         <div className="chart-loader-wrapper">
            <div className="chart-loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>Loading...</p>
        </div>
    )
}

export default LoadingSpinner
