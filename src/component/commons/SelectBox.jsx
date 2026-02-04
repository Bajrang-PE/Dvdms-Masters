import React from 'react';

const SelectBox = ({
  name,
  value,
  options = [],
  required = false,
  disabled = false,
  onChange,
  onBlur,
  error = "",
  placeholder = "Select an option",
  className = "",
  selectClass = "",
}) => {
  return (
    <div className={`mb-2 ${selectClass}`}>
      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-1 border ${
          error ? "ring-1 ring-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-[#9b0000] mt-1 ms-1">{error}</span>}
    </div>
  );
};

export default SelectBox;
