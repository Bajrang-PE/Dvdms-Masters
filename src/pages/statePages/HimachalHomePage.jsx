import React from 'react'
import {
    FaHome,
    FaInfoCircle,
    FaPhoneAlt,
    FaStar,
    FaLink,
    FaHistory,
} from 'react-icons/fa';
import TopBar from '../../component/headers/TopBar'
import NavBar from '../../component/headers/NavBar'
import TopMasterJH from '../../component/stateHomepageCmp/jharkhand/TopMasterJH';
import AboutSection from '../../component/stateHomepageCmp/jharkhand/AboutSection';
import FeaturesSectionJH from '../../component/stateHomepageCmp/jharkhand/FeaturesSectionJH';
import UsefulLinksJH from '../../component/stateHomepageCmp/jharkhand/UseFulLinksJH';
import GalleryJH from '../../component/stateHomepageCmp/jharkhand/GalleryJH';
import PatientComplaintFormJH from '../../component/stateHomepageCmp/jharkhand/PatientComplaintFormJH';
import FooterJH from '../../component/stateHomepageCmp/jharkhand/FooterJH';
import FooterHP from '../../component/stateHomepageCmp/HimachalPradesh/FooterHP';

const HimachalHomePage = () => {

    const menuItems = [
        { to: '', icon: <FaHome />, label: 'Home', id: '' },
        { to: '', icon: <FaInfoCircle />, label: 'About', id: 'aboutus' },
        { to: '', icon: <FaStar />, label: 'Features', id: 'featuresjh' },
        { to: '', icon: <FaLink />, label: 'Link', id: 'linkjh' },
        { to: '', icon: <FaHistory />, label: 'History', id: 'galleryjh' },
        { to: '', icon: <FaPhoneAlt />, label: 'Contact', id: 'contactjh' },
    ];

    const aboutData = {
        title: "Supply of Quality Medicine Transparent Drug Procurement Procedure Upto Date Medicine Inventory.",
        des: "DVDMS (Drugs and Vaccine Distribution Management System) is a software platform to automate various activities of Directorate General Medical Health, Govt. Of Himachal Pradesh. It comprises of Drug and Vaccine Supply Chain Management that deals with Purchase Order, Inventory Management & Distribution of various drugs etc. Also it helps for managing receipt, Issue, Quality Control, vaccines and other health sector goods that are supplied to States under various disease control programmes.",
        image: "/jh_about.png"
    }

    return (
        <section className="page home-page">
            <TopBar title={"i-MCS | Drugs and Vaccine Distribution Management System"} subtitle={"Directorate of Health & Family Welfare Himachal Pradesh"} logoUrl={"/JH_Logo.png"} isEmail={false} isLocation={false} bg={'#00000073'} isHelpDesk={false} />
            <NavBar logoUrl={"/JH_Logo.png"} menuItems={menuItems} />
            <TopMasterJH image={"/banner_hp.png"}/>
            <AboutSection title={aboutData?.title} description={aboutData?.des} image={aboutData?.image} />
            <FeaturesSectionJH />
            <UsefulLinksJH />
            <GalleryJH title={"History"}/>
            <FooterHP />
        </section>
    )
}

export default HimachalHomePage
