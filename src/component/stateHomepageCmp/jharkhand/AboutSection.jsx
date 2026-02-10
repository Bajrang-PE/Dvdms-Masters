import React from 'react'

const AboutSection = (props) => {
    const { title, description, image } = props;

    return (
        <>
            <section className="py-10 bg-gradient-to-br from-blue-50 to-indigo-50" id='aboutus'>
                <div className="mx-auto px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* About Section */}
                        <div className="overflow-hidden">
                            <div className="py-4 md:p-2">
                                <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">
                                    About
                                </h2>

                                <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                                    {title}
                                </h3>

                                <p className="text-gray-600 mb-6">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Opening Hours Section */}

                        <div className="rounded-2xl shadow-xl overflow-hidden border border-indigo-500/30 mt-4">
                            <div className="p-3 text-white">
                                <div className="">
                                    <img
                                        src={image}
                                        alt="NHM & AMSCL Locations"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutSection
