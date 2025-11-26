import React, { useState } from 'react'
import InputBox from '../../commons/InputBox';
import SelectBox from '../../commons/SelectBox';

const PatientComplaintFormJH = () => {

    const [formData, setFormData] = useState({
        patientName: '',
        mobileNo: '',
        address: '',
        district: 'All',
        healthFacility: '',
        medicine: '',
        complaintType: 'Unavailability',
        comments: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md p-6" id='pateintcompjh'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-gray-200 pb-2">
                Patient Complaint Details:
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2 bg-[#5f9ea0] p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                            Patient Name:
                        </label>
                        <InputBox
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            placeholder="Enter patient name"
                            className="bg-gray-50"
                            required={true}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                            *Mobile No.:
                        </label>
                        <InputBox
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            type="number"
                            placeholder="Enter mobile number"
                            required={true}
                            className="bg-gray-50"
                        />
                    </div>
                </div>

                {/* Address - Full Width */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address:
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                        placeholder="Enter complete address"
                    />
                </div>

                {/* Second Row - District & Health Facility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                            *Districts:
                        </label>
                        <SelectBox
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            className="bg-gray-50"
                        >
                        </SelectBox>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                            *Health Facility:
                        </label>
                        <SelectBox
                            name="healthFacility"
                            value={formData.healthFacility}
                            onChange={handleChange}
                            required
                            className="bg-gray-50"
                        >
                        </SelectBox>
                    </div>
                </div>

                {/* Third Row - Medicine & Complaint Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                            *Drug (Medicine):
                        </label>
                        <SelectBox
                            name="medicine"
                            value={formData.medicine}
                            onChange={handleChange}
                            required
                            className="bg-gray-50"
                            options={[{ value: "vaxofarma", label: "Vaxofarma" }]}
                        >
                        </SelectBox>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Complaint Type:
                        </label>
                        <SelectBox
                            name="complaintType"
                            value={formData.complaintType}
                            onChange={handleChange}
                            className="bg-gray-50"
                        >
                        </SelectBox>
                    </div>
                </div>

                {/* Comments - Full Width */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        *Comments:
                    </label>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                        placeholder="Enter your comments here..."
                    />
                </div>

                {/* Submit Button */}
                <div className='text-center'>
                    <button
                        type="submit"
                        className="w-50 bg-gradient-to-r from-yellow-600 to-red-300 text-gray-800 py-2 px-2 hover:text-[#941714] border !border-yellow-600 !hover:border-yellow-900 font-medium"
                        style={{ borderRadius: "10px" }}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PatientComplaintFormJH;
