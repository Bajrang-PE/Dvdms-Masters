import React from 'react'

const MasterSlider = () => {
    return (
        <>
            <div className="slider-one">
                <div className="slider-one-image">
                    <div className="slider-text">
                        <h1 className="fw-bold lh-base">Drug and Vaccine<br />
                            <span className="fw-semibold">Supply Chain Management</span>
                        </h1>
                        <p className="fw-light">e-Aushadhi Assam is a web based supply chain management application
                            deals with Indenting
                            based procurement, Inventory Management &amp; Distribution of various drugs, sutures and
                            surgical items to various CDS of States, Hospitals, Diagnostic Center (DC) and Dispensary
                            (DS) the final consumer of the supply chain.
                        </p>
                    </div>
                </div>
            </div>

            <div
                className={`amscldesc absolute top-1/2 p-4 text-white`}
            >
                <h2 className="text-2xl font-bold mb-3">THE AMSCL</h2>
                <small className="text-white bg-blue-600 px-2 py-1 rounded">envisages attainment of universal access</small>
                <div className="punchline mt-3 text-lg">
                    to equitable, affordable and quality health care services in the
                </div>
                <img
                    src="http://10.10.11.155:8081/HIS/hisglobal/mod/assets/img/state-of-assam.png"
                    className="mt-3 max-h-16"
                    alt="State of Assam"
                />
            </div>

        </>
    )
}

export default MasterSlider
