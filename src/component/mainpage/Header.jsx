import React, { useContext } from 'react'

const Header = ({ setShowCmsLogin }) => {

    const onCmsLogin = () => {
        setShowCmsLogin(true);
    }


    return (
        <>

            <div className='container-fluid py-1 header-bar'>
                <div className="row">
                    <div className='col-md-3'>
                        <div className='logo d-flex align-items-center'>
                            <a className="pt-1" href="https://www.india.gov.in/" target="_blank" >
                                <img src="https://uatcdash.dcservices.in/HIS/hisglobal/CDBTemplate_V_3/Images/sher.png" className='logo-image' alt="logo" />
                            </a>
                            <div className="dvdms-outer">
                                <div className="dvdms-title ms-2 mt-1">
                                    <h5 className="text-white mb-0" style={{ fontSize: "larger" }}>Unified Dvdms</h5>
                                    <p className="text-white mb-0" style={{ fontSize: "13px" }}>Ministry of Health &amp; Family Welfare<br /> (Govt. of India)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8 d-block d-xl-flex align-items-center justify-content-end p-lg-0 p-1">

                        <div className="buttons d-block d-md-flex align-items-end">

                            <a className="btn header-image me-lg-2 me-1" onClick={() => onCmsLogin()}>State Login</a>

                        </div>
                    </div>
                    
                    <div className='col-md-1'>
                        <img src="https://uatcdash.dcservices.in/HIS/hisglobal/CDBTemplate_V_3/Images/nlm5.png" alt="logo" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
