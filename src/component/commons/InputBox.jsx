import React from 'react';

const InputBox = ({
  name,
  value,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  onChange,
  onBlur,
  error = "",
  className = "",
  inputClass = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default InputBox;
