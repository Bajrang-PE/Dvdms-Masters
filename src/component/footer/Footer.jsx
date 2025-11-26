import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#111827] to-indigo-900 text-white pt-10 pb-4">
            <div className="mx-auto px-4">

                <div className="flex flex-col lg:flex-row gap-4 items-start">
                    {/* Left Section - Logo with Title */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:w-2/5">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10 flex-shrink-0 rounded">
                            <img
                                src="/logo.png"
                                alt="DVDMS Logo"
                                className="object-contain"
                                style={{height:"4rem"}}
                            />
                        </div>

                        <div className="!lg:text-left">
                            <h5 className="!text-xl !font-bold mb-1 animate-color-flow">AMSCL, Govt. of Assam</h5>
                            <h6 className="!text-sm !font-semibold !text-blue-200 !mb-6">DVDMS (e-Austradh)</h6>

                            <a href="mailto:ms.nhm-as@gov.in" className="!text-blue-100 !hover:text-white !transition-colors text-sm flex items-center" >
                                <FaEnvelope className="text-white-600 text-lg mr-2" />
                                ms.nhm-as@gov.in
                            </a>

                        </div>
                    </div>

                    <div className="lg:w-3/5 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-sm text-blue-100 leading-relaxed">
                                    Drug Vaccine Distribution Management System (DVDMS) is a web based Supply chain management of Drugs, Surgical sutures
                                </p>
                                <p className="text-lg text-blue-200 italic">
                                    Powered By Over 600 drugs to serve you well
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/15 transition-colors">
                                    <div className="text-2xl font-bold mb-1">10,785</div>
                                    <div className="text-xs text-blue-200">Indenter</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/15 transition-colors">
                                    <div className="text-2xl font-bold mb-1">785</div>
                                    <div className="text-xs text-blue-200">Quality Drugs</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/15 transition-colors">
                                    <div className="text-2xl font-bold mb-1">5</div>
                                    <div className="text-xs text-blue-200">Labs</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/15 transition-colors">
                                    <div className="text-2xl font-bold mb-1">35</div>
                                    <div className="text-xs text-blue-200">Warehouses</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <p className="text-xs text-blue-100 leading-relaxed m-2 p-2 text-center">
                    Website owned and maintained by :
                    <span className="font-medium"> Centre for Development of Advanced Computing (CDAC)</span>
                </p>

                {/* Copyright */}
                <div className="mt-2 pt-4 border-t border-white/10 text-center text-sm text-blue-200">
                    © {new Date().getFullYear()} AMSCL, Govt. of Assam. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;