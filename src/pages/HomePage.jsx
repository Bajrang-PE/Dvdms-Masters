import React from 'react'
import NavBar from '../component/headers/NavBar'
import TopBar from '../component/headers/TopBar'
import MasterSlider from '../component/homepage/MasterSlider'

const HomePage = () => {
    return (
        <section className="page home-page">
            <TopBar/>
            <NavBar/>
            <MasterSlider/>

        </section>
    )
}

export default HomePage
