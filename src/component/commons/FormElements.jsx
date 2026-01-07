import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Virtuoso } from "react-virtuoso";

export function ComboDropDown({
  options = [],
  value,
  onChange,
  label,
  name,
  addOnClass = "",
  isDisabled = false,
}) {
  const DROPDOWN_HEIGHT = 180;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (isDisabled) {
      setIsOpen(false);
    }
  }, [isDisabled]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen && !isDisabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isDisabled]);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggleDropdown = () => {
    if (isDisabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    if (isDisabled) return;

    const fakeEvent = { target: { name, value: option.value } };
    onChange(fakeEvent);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((opt) =>
      String(opt.label).toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, options]);

  return (
    <div
      className={`Wrapper ${addOnClass} ${isDisabled ? "Wrapper--disabled" : ""
        }`}
      ref={wrapperRef}
    >
      {label && <label className="Wrapper__label">{label}</label>}

      <div
        className="Wrapper__select"
        onClick={toggleDropdown}
        aria-disabled={isDisabled}
      >
        {selectedOption ? selectedOption.label : "Please Select"}
      </div>

      {filteredOptions.length > 0 && isOpen && !isDisabled && (
        <div className="Wrapper__select--menu">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="Wrapper__search"
            disabled={isDisabled}
          />

          <Virtuoso
            style={{ height: DROPDOWN_HEIGHT }}
            totalCount={filteredOptions.length}
            itemContent={(index) => (
              <div
                key={filteredOptions[index].value}
                className="Wrapper__select--option"
                onClick={() => handleSelect(filteredOptions[index])}
              >
                {filteredOptions[index].label}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

export function InputField({
  type,
  id,
  name,
  placeholder,
  className,
  onChange,
  value,
  disabled = false,
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
}

export const RadioButton = ({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  addonStyles = "",
  keyProp = "",
}) => {
  return (
    <label className={`radio-button ${addonStyles}`} key={keyProp}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
};

export const DatePickerComponent = ({
  selectedDate,
  setSelectedDate,
  labelText,
  labelFor,
  allowMin = false,
  disableFutureDates = false,
  labelBold = false,
  disabled = false,
  isRequired = false
}) => {
  const handleChange = (date) => {
    setSelectedDate(date);
  };

  // Min date logic
  const minDate = allowMin ? new Date(2000, 0, 1) : new Date();

  // Max date logic (today)
  const maxDate = disableFutureDates ? new Date() : undefined;

  return (
    <div>
      <label htmlFor={labelFor} className={`bankmaster__label ${isRequired ? 'required-label' : ""}`}>
        {labelBold ? <b>{labelText}</b> : labelText}
      </label>
      <DatePicker
        id={labelFor}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd-MMM-yyyy"
        minDate={minDate}
        maxDate={maxDate}
        placeholderText="dd-MMM-yyyy"
        withPortal
        className="custom-datepicker"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={20}
        disabled={disabled}
      />
    </div>
  );
};
