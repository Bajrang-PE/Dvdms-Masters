import React, { useState } from 'react';
import NavBar from '../../component/headers/NavBar';
import TopBar from '../../component/headers/TopBar';
import AboutSection from '../../component/stateHomepageCmp/jharkhand/AboutSection';
import FeaturesSectionJH from '../../component/stateHomepageCmp/jharkhand/FeaturesSectionJH';
import UsefulLinksJH from '../../component/stateHomepageCmp/jharkhand/UseFulLinksJH';
import GalleryJH from '../../component/stateHomepageCmp/jharkhand/GalleryJH';
import FooterJH from '../../component/stateHomepageCmp/jharkhand/FooterJH';
import TopMasterJH from '../../component/stateHomepageCmp/jharkhand/TopMasterJH';
import {
    FaHome,
    FaInfoCircle,
    FaPhoneAlt,
    FaStar,
    FaLink,
    FaImages,
    FaUserInjured
} from 'react-icons/fa';
import PatientComplaintFormJH from '../../component/stateHomepageCmp/jharkhand/PatientComplaintFormJH';

const JharkhandHomePage = () => {

    const menuItems = [
        { to: '', icon: <FaHome />, label: 'Home', id: '' },
        { to: '', icon: <FaInfoCircle />, label: 'About', id: 'aboutus' },
        { to: '', icon: <FaStar />, label: 'Features', id: 'featuresjh' },
        { to: '', icon: <FaLink />, label: 'Link', id: 'linkjh' },
        { to: '', icon: <FaImages />, label: 'Gallery', id: 'galleryjh' },
        { to: '', icon: <FaPhoneAlt />, label: 'Contact', id: 'contactjh' },
        { to: '', icon: <FaUserInjured />, label: 'Patient Complaint', id: 'pateintcompjh' },
    ];

    const aboutData = {
        title: "Supply of Quality Medicine Transparent Drug Procurement Procedure Upto Date Medicine Inventory.",
        des: "DVDMS (Drugs and Vaccine Distribution Management System) is a software platform to automate various activities of Directorate General Medical Health, Govt. Of Jharkhand. It comprises of Drug and Vaccine Supply Chain Management that deals with Purchase Order, Inventory Management & Distribution of various drugs etc. Also it helps for managing receipt, Issue, Quality Control, vaccines and other health sector goods that are supplied to States under various disease control programmes.",
        image: "/jh_about.png"
    }



    return (
        <section className="page home-page">
            <TopBar title={"JMHIDPCL i-MCS"} subtitle={"Jharkhand Medical & Health Infrastructure Development & Procurement Corporation Ltd."} logoUrl={"/JH_Logo.png"} isEmail={false} isLocation={false} bg={'#00000073'} isHelpDesk={true} />
            <NavBar logoUrl={"/JH_Logo.png"} menuItems={menuItems} />
            <TopMasterJH image={"/banner_map_jh.jpg"}/>
            <AboutSection title={aboutData?.title} description={aboutData?.des} image={aboutData?.image} />
            <FeaturesSectionJH />
            <UsefulLinksJH />
            <GalleryJH title={"Gallery"}/>
            <PatientComplaintFormJH />
            <FooterJH />
        </section>
    )
}

export default JharkhandHomePage;
