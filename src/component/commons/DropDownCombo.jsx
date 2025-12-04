import React, { useState, useRef, useEffect } from "react";

const DropDownCombo = ({
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];

  const filteredOptions = safeOptions.filter((o) =>
    (o.label || "").toLowerCase().includes(search.toLowerCase())
  );

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt) => {
    if (disabled) return;

    onChange?.({ target: { name, value: opt.value } });
    onBlur?.({ target: { name, value: opt.value } });

    setOpen(false);
    setSearch("");
  };

  return (
    <div className={`mb-2 relative ${selectClass}`} ref={wrapperRef}>
      {/* 🔥 Hidden real <select> for form + devtools */}
      <select
        id={name}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="hidden"
      >
        <option value="">{placeholder}</option>
        {safeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Visible combobox */}
      <div
        tabIndex={0}
        onClick={() => !disabled && setOpen((p) => !p)}
        onFocus={() => {}}
        className={`w-full px-4 py-1 border relative bg-white rounded-lg cursor-pointer select-none
          ${error ? "ring-1 ring-red-500" : "border-gray-300"}
          focus-within:ring-1 focus-within:ring-blue-500
          ${className}
        `}
      >
        {/* text */}
        {value
          ? safeOptions.find((o) => o.value === value)?.label
          : placeholder}

        {/* ▼ dropdown arrow */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {/* Dropdown menu */}
      {open && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white shadow-lg border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
          {/* Search box */}
          <div className="p-2 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              placeholder="Search..."
              className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  value === opt.value ? "bg-blue-50" : ""
                }`}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options found
            </div>
          )}
        </div>
      )}

      {/* error message */}
      {error && (
        <span className="text-sm text-[#9b0000] mt-1 ms-1">{error}</span>
      )}
    </div>
  );
};

export default DropDownCombo;
