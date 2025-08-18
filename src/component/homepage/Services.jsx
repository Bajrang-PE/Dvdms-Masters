import { FaWarehouse, FaClipboardList, FaChartLine, FaFileInvoiceDollar, FaUsersCog, FaChartPie, FaPills, FaQuestion, FaArrowRight, FaBoxes, FaTruck, FaFirstAid, FaGlobeAmericas, FaBoxOpen, FaTruckLoading, FaHeartbeat } from 'react-icons/fa';

const Services = () => {
    const services = [
        {
            icon: <FaPills className="w-8 h-8" />,
            title: "Drug Section",
            description: "Carry out procurement of drugs.",
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            icon: <FaWarehouse className="w-8 h-8" />,
            title: "Warehouses",
            description: "Storage and Distribution of drugs to Health Facility.",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100"
        },
        {
            icon: <FaClipboardList className="w-8 h-8" />,
            title: "Empanelment",
            description: "Registration of Indenter, Manufacturer, QC Labs, etc.",
            color: "text-amber-600",
            bgColor: "bg-amber-100"
        },
        {
            icon: <FaChartLine className="w-8 h-8" />,
            title: "Reports Section",
            description: "To generate reports based on user requirements.",
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        },
        {
            icon: <FaQuestion className="w-8 h-8" />,
            title: "QA Section",
            description: "To ensure the quality of drugs.",
            color: "text-red-600",
            bgColor: "bg-red-100"
        },
        {
            icon: <FaFileInvoiceDollar className="w-8 h-8" />,
            title: "Account Section",
            description: "Payment of Bills, Preparation of Accounts",
            color: "text-indigo-600",
            bgColor: "bg-indigo-100"
        },
        {
            icon: <FaUsersCog className="w-8 h-8" />,
            title: "Admin Section",
            description: "Establishment and Personnel work.",
            color: "text-cyan-600",
            bgColor: "bg-cyan-100"
        },
        {
            icon: <FaChartPie className="w-8 h-8" />,
            title: "Dashboard",
            description: "Statistical Maintenance of Data",
            color: "text-green-600",
            bgColor: "bg-green-100"
        }
    ];

    const features = [
        {
            icon: <FaBoxes className="w-8 h-8" />,
            title: "Storage & Supply",
            description: "Procurement, storage and supply of medicines, surgical items, medical equipment and other medical supplies required by public health facilities across the country.",
            color: "text-indigo-600",
            bgColor: "bg-indigo-100"
        },
        {
            icon: <FaGlobeAmericas className="w-8 h-8" />,
            title: "Organised Distribution",
            description: "Receipt, storage and distribution of supplies of drugs and allied stores including various vaccines received from international bodies under bilateral agreements.",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100"
        },
        {
            icon: <FaFirstAid className="w-8 h-8" />,
            title: "Life Saving Drugs",
            description: "Meeting emergency requirements of life saving drugs arising from natural calamities like floods, cyclones, and national emergencies.",
            color: "text-red-600",
            bgColor: "bg-red-100"
        },
        {
            icon: <FaTruck className="w-8 h-8" />,
            title: "Rapid Response",
            description: "Ensuring timely delivery of critical medical supplies to disaster-affected areas with our priority distribution network.",
            color: "text-amber-600",
            bgColor: "bg-amber-100"
        }
    ];


    return (
        <>
            <section className="py-12 bg-gradient-to-b from-white to-blue-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-left mb-8">
                        <h2 className="text-3xl font-bold text-blue-900 mb-2">SERVICES</h2>
                        <p className="text-xl text-blue-600 font-medium mb-4">
                            Provide best quality healthcare for you!
                        </p>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                            >
                                <div className="p-4">
                                    <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <span className={service.color}>{service.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                                <div className="px-6 pb-4">
                                    <button className={`text-sm font-medium ${service.color} hover:underline flex items-center`}>
                                        Learn more
                                        <FaArrowRight className="w-5 h-3 ml-2" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-8 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch"> {/* Changed to items-stretch */}
                        {/* Cards Section - Takes 2/3 width */}
                        <div className="lg:w-2/3">
                            <div className="text-left mb-8">
                                <h2 className="text-3xl font-bold text-blue-900 mb-2">Features</h2>
                                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Card 1 */}
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                            <FaBoxes className="text-blue-600 text-lg" />
                                        </div>
                                        <h3 className="text-md font-semibold text-gray-800">Storage and Supply</h3>
                                    </div>
                                    <p className="text-gray-600 text-xs leading-5 flex-grow">
                                        Procurement, storage and supply of medicines, surgical items, medical equipment and other medical supplies/stores required by public health facilities/units across the country.
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                                            <FaBoxes className="text-green-600 text-lg" />
                                        </div>
                                        <h3 className="text-md font-semibold text-gray-800">Organised Distribution</h3>
                                    </div>
                                    <p className="text-gray-600 text-xs leading-5 flex-grow">
                                        Receipt, storage and distribution of supplies of drugs and allied stores including various vaccines received from WHO, UNICEF, USAID, DFID and other international bodies.
                                    </p>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-red-100 p-2 rounded-lg mr-3">
                                            <FaFirstAid className="text-red-600 text-lg" />
                                        </div>
                                        <h3 className="text-md font-semibold text-gray-800">Life Saving Drugs</h3>
                                    </div>
                                    <p className="text-gray-600 text-xs leading-5 flex-grow">
                                        Meeting emergency requirements of life saving drugs arising from natural calamities like floods, cyclones, and national emergencies.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Section - Takes 1/3 width but taller */}
                        <div className="lg:w-1/3 flex mb-4">
                            <div className="bg-gray-100 rounded-lg overflow-hidden w-full">
                                <img
                                    src="http://10.10.11.155:8081/HIS/hisglobal/mod/assets/img/features-img.png"
                                    alt="Medical Supply Chain"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Services;