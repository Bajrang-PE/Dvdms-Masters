import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp, FaHospital, FaUser } from 'react-icons/fa';

const ContactSection = () => {
    const [expandedContact, setExpandedContact] = useState(null);

    const toggleContact = (index) => {
        setExpandedContact(expandedContact === index ? null : index);
    };

    const contacts = [
        {
            title: "HQ (NHM and AMSCL)",
            locations: [
                {
                    name: "Vanendu Mohan Choudhury Hospital",
                    address: "NHM & AMSCL, Govt. of Assam, Assam PIN : 781026",
                    official: "Mitul Lahkar",
                    phone: "9957566557",
                    email: "mmchkannupmetro@gmail.com",
                    image: "http://10.10.11.155:8081/HIS/hisglobal/homepage/images/assam-medical-colleges.jpg"
                },
                {
                    name: "Vanendu Mohan Choudhury HospitalB",
                    address: "NHM & AMSCL, Govt. of Assam, Assam PIN : 781026",
                    official: "Mitul Lahkar",
                    phone: "9957566557",
                    email: "mmchkannupmetro@gmail.com",
                    image: "http://10.10.11.155:8081/HIS/hisglobal/homepage/images/assam-medical-colleges.jpg"
                }
            ]
        },
        {
            title: "AMSCL Contacts",
            locations: [
                {
                    name: "Vanendu Mohan Choudhury Hospital",
                    address: "NHM & AMSCL, Govt. of Assam, Assam PIN : 781026",
                    official: "Mitul Lahkar",
                    phone: "9957566557",
                    email: "mmchkannupmetro@gmail.com",
                    image: "http://10.10.11.155:8081/HIS/hisglobal/homepage/images/assam-medical-colleges.jpg"
                }
            ]
        }
    ];

    return (
        <section className="py-8 bg-gradient-to-b from-blue-50 to-blue-100" id='contacts'>
            <div className="mx-auto px-8">
                <div className="text-left mb-4">
                    <h2 className="text-3xl font-bold text-blue-900 mb-2">NHM & AMSCL CONTACTS</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Map Section */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden h-fit sticky top-6">
                        <div className="p-2 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                <FaMapMarkerAlt className="text-red-500 mr-2" />
                                Contact Locations
                            </h3>
                        </div>
                        <div className="">
                            <img
                                src="/contactLocation.jpg"
                                alt="NHM & AMSCL Locations"
                                className="w-full h-full object-cover"
                                // onError={(e) => {
                                //     e.target.src = "https://via.placeholder.com/600x600?text=Map+Not+Available";
                                // }}
                            />
                        </div>
                    </div>

                    {/* Contact List */}
                    <div className="space-y-6">
                        {contacts.map((contact, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                                <button
                                    onClick={() => toggleContact(index)}
                                    className="w-full flex justify-between items-center p-2 hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                            <FaHospital className="text-blue-600 text-lg" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-indigo-800">{contact.title + `(${contact?.locations?.length || 0})`}</h3>
                                    </div>
                                    {expandedContact === index ? (
                                        <FaChevronUp className="text-gray-500 text-lg" />
                                    ) : (
                                        <FaChevronDown className="text-gray-500 text-lg" />
                                    )}
                                </button>

                                {expandedContact === index && (
                                    <div className="p-2 pt-1 border-t border-indigo-300">
                                        {contact.locations.map((location, i) => (
                                            <div key={i} className="mb-4 last:mb-0 bg-white p-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="text-lg font-medium text-blue-800 mb-4">{location.name}</h4>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-start">
                                                                <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                                                <p className="text-gray-600">{location.address}</p>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaUser className="text-blue-500 mr-3 flex-shrink-0" />
                                                                <span className="text-gray-600">
                                                                    Concerned Official : {location.official || "---"}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaPhone className="text-blue-500 mr-3 flex-shrink-0" />
                                                                <span className="text-gray-600">{location.phone}</span>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <FaEnvelope className="text-blue-500 mr-3 flex-shrink-0" />
                                                                <span className="text-gray-600">{location.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-xl overflow-hidden border border-gray-400">
                                                        <img
                                                            src={location.image}
                                                            alt={location.name}
                                                            className="w-full h-full object-cover"
                                                            // onError={(e) => {
                                                            //     e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                                                            // }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;