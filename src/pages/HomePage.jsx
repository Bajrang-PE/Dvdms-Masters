import React from 'react'
import NavBar from '../component/headers/NavBar'
import TopBar from '../component/headers/TopBar'
import MasterSlider from '../component/homepage/MasterSlider'
import AboutAmscl from '../component/homepage/AboutAmscl'
import Services from '../component/homepage/Services'
import ContactSection from '../component/homepage/ContactSection'
import Footer from '../component/footer/Footer'

const HomePage = () => {
    return (
        <section className="page home-page">
            <TopBar />
            <NavBar />
            <MasterSlider />
            <AboutAmscl />
            <Services />
            <ContactSection/>
            <Footer/>
        </section>
    )
}

export default HomePage
