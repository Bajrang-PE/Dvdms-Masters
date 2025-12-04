import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Virtuoso } from 'react-virtuoso';

export function ComboDropDown({
  options = [],
  value,
  onChange,
  label,
  name,
  addOnClass = '',
}) {
  const DROPDOWN_HEIGHT = 180;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleSelect = option => {
    const fakeEvent = { target: { name, value: option.value } };
    onChange(fakeEvent);
    closeDropdown();
    setSearchTerm('');
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter(opt =>
      String(opt.label).toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, options]);

  return (
    <div className={`Wrapper ${addOnClass}`} ref={wrapperRef}>
      {label && <label className="Wrapper__label">{label}</label>}

      {options.length === 0 && (
        <div className="Wrapper__select" disabled>
          NA
        </div>
      )}

      {options.length > 0 && (
        <div className="Wrapper__select" onClick={toggleDropdown}>
          {selectedOption ? selectedOption.label : 'Please Select'}
        </div>
      )}

      {filteredOptions.length > 0 && isOpen && (
        <div className="Wrapper__select--menu">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="Wrapper__search"
          />
          <Virtuoso
            style={{ height: DROPDOWN_HEIGHT }}
            totalCount={filteredOptions.length}
            itemContent={index => (
              <div
                key={filteredOptions[index].value}
                className="Wrapper__select--option"
                onClick={() => handleSelect(filteredOptions[index])}
                style={{ height: 'max-content' }}
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
  addonStyles = '',
  key = '',
}) => {
  return (
    <label className={`radio-button ${addonStyles}`} key={key}>
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
}) => {
  const handleChange = date => {
    setSelectedDate(date);
  };

  // If allowMin is true, allow going back to 1900, otherwise minDate is today
  const minDate = allowMin ? new Date(2000, 0, 1) : new Date();

  return (
    <>
      <label htmlFor={labelFor} className="bankmaster__label">
        {labelText}
      </label>
      <DatePicker
        id={labelFor}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd-MMM-yyyy"
        minDate={minDate}
        placeholderText="dd-MMM-yyyy"
        withPortal
        className="custom-datepicker"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={20} // Show 20 years in dropdown
      />
    </>
  );
};
