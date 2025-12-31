import React, { useState } from 'react'
import InputBox from '../../commons/InputBox';
import SelectBox from '../../commons/SelectBox';

const PatientComplaintFormJH = () => {

    const [formData, setFormData] = useState({
        patientName: '',
        mobileNo: '',
        address: '',
        district: '',
        healthFacility: '',
        medicine: '',
        complaintType: '',
        comments: ''
    });

    const [errors, setErrors] = useState({
        patientNameErr: '',
        mobileNoErr: '',
        districtErr: '',
        healthFacilityErr: '',
        medicineErr: '',
        commentsErr: ''
    })

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
    };

    const handleValidation = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData?.patientName?.trim()) {
            setErrors(prev => ({ ...prev, "patientNameErr": "Patient name is required!" }))
            isValid = false;
        }
        if (!formData?.mobileNo?.trim()) {
            setErrors(prev => ({ ...prev, "mobileNoErr": "Mobile number is required!" }))
            isValid = false;
        }
        if (!formData?.district?.trim()) {
            setErrors(prev => ({ ...prev, "districtErr": "Please select district!" }))
            isValid = false;
        }
        if (!formData?.healthFacility?.trim()) {
            setErrors(prev => ({ ...prev, "healthFacilityErr": "Please select health facility!" }))
            isValid = false;
        }
        if (!formData?.medicine?.trim()) {
            setErrors(prev => ({ ...prev, "medicineErr": "Please select medicine!" }))
            isValid = false;
        }
        if (!formData?.comments?.trim()) {
            setErrors(prev => ({ ...prev, "commentsErr": "Comments is required!" }))
            isValid = false;
        }

        if (isValid) {
            handleSubmit();
        }
    }

    const handleChange = (e) => {
        const { name, value } = e?.target;
        const errName = name + "Err";

        if (name) {
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [errName]: '' });
        }
    };


    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md p-6" id='pateintcompjh'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-gray-200 pb-2">
                Patient Complaint Details:
            </h2>

            <form onSubmit={handleValidation} className="space-y-2 bg-[#5f9ea0] py-8 px-10 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 mb-0">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2 required-label">
                            Patient Name:
                        </label>
                        <InputBox
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            placeholder="Enter patient name"
                            className="bg-gray-50"
                            error={errors?.patientNameErr}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2 required-label">
                            Mobile No.:
                        </label>
                        <InputBox
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            type="number"
                            placeholder="Enter mobile number"
                            className="bg-gray-50"
                            error={errors?.mobileNoErr}
                        />
                    </div>
                </div>

                {/* Address */}
                <div className='mb-0'>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
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

                {/*District & Health Facility */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 mb-0">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2 required-label">
                            Districts:
                        </label>
                        <SelectBox
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="bg-gray-50"
                            error={errors?.districtErr}
                            options={[{ value: "ramgarh", label: "Ramgarh" }]}
                        >
                        </SelectBox>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2 required-label">
                            Health Facility:
                        </label>
                        <SelectBox
                            name="healthFacility"
                            value={formData.healthFacility}
                            onChange={handleChange}
                            className="bg-gray-50"
                            error={errors?.healthFacilityErr}
                            options={[{ value: "kuchnhi", label: "Kuch Bhi Nahi he" }]}
                        >
                        </SelectBox>
                    </div>
                </div>

                {/* Medicine & Complaint Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 mb-0">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2 required-label">
                            Drug (Medicine):
                        </label>
                        <SelectBox
                            name="medicine"
                            value={formData.medicine}
                            onChange={handleChange}
                            className="bg-gray-50"
                            options={[{ value: "khatam", label: "Khatam Ho Gayi" }]}
                            error={errors?.medicineErr}
                        >
                        </SelectBox>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Complaint Type:
                        </label>
                        <SelectBox
                            name="complaintType"
                            value={formData.complaintType}
                            onChange={handleChange}
                            className="bg-gray-50"
                            options={[{ value: "cmptyp", label: "Ab tu bhi complaint karega bhai" }]}
                        >
                        </SelectBox>
                    </div>
                </div>

                {/* Comments - Full Width */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2 required-label">
                        Comments:
                    </label>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
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
