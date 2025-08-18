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
    <div className={`mb-4 ${className}`}>
      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default SelectBox;
