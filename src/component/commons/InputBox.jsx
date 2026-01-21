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
    <div className={`mb-2 ${inputClass}`}>
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
        className={`w-full px-4 py-1 border ${error ? "ring-1 ring-red-500" : "ring-gray-500"
          } rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 ${className}`}
      />
      {error && <span className="text-sm text-[#9b0000] mt-1 ms-1">{error}</span>}
    </div>
  );
};

export default InputBox;