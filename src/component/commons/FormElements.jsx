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
  isRequired = false,
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
      {label && <label className={`Wrapper__label ${isRequired ? 'required-label' : ""}`}>{label}</label>}

      <div
        className="Wrapper__select"
        onClick={toggleDropdown}
        aria-disabled={isDisabled}
      >
        {selectedOption ? selectedOption.label : "Please Select"}
      </div>

      {isOpen && !isDisabled && (
        <div className="Wrapper__select--menu">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="Wrapper__search"
            disabled={isDisabled}
          />
          {filteredOptions.length > 0 ?
            <Virtuoso
              style={{ height: DROPDOWN_HEIGHT }}
              totalCount={filteredOptions.length}
              itemContent={(index) => (
                <div
                  key={filteredOptions[index].value}
                  className="Wrapper__select--option"
                  onClick={() => handleSelect(filteredOptions[index])}
                  value={filteredOptions[index].value}
                >
                  {filteredOptions[index].label}
                </div>
              )}
            />
            :
            <div
              key={""}
              className="Wrapper__select--option"
              // onClick={() => handleSelect(filteredOptions[index])}
              value={''}
            >
              {"No Records!"}
            </div>
          }
        </div>
      )}
    </div>
  );
}

// export function InputField({
//   type,
//   id,
//   name,
//   placeholder,
//   className,
//   onChange,
//   value,
//   disabled = false,
//   readOnly = false,
//   isNumber = false,
//   isAlpha = false
// }) {
//   return (
//     <input
//       type={type}
//       id={id}
//       name={name}
//       placeholder={placeholder}
//       className={className}
//       onChange={onChange}
//       value={value}
//       disabled={disabled}
//       readOnly={readOnly}
//     />
//   );
// }

export function InputField({
  type = "text",
  id,
  name,
  placeholder,
  className,
  onChange,
  value,
  disabled = false,
  readOnly = false,
  isNumber = false,
  isAlpha = false,
  label,
  isRequired,
  isError
}) {

  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (isNumber && !isAlpha) {
      // only numbers
      inputValue = inputValue.replace(/[^0-9]/g, '');
    } else if (isAlpha && !isNumber) {
      // only alphabets
      inputValue = inputValue.replace(/[^a-zA-Z]/g, '');
    } else if (isAlpha && isNumber) {
      // allow alphanumeric
      inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
    }
    const result = {
      // Preserve the original event properties
      nativeEvent: e.nativeEvent,
      timeStamp: e.timeStamp,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      defaultPrevented: e.defaultPrevented,
      eventPhase: e.eventPhase,
      isTrusted: e.isTrusted,

      // Preserve common React event methods
      preventDefault: e.preventDefault.bind(e),
      stopPropagation: e.stopPropagation.bind(e),
      persist: e.persist?.bind(e),

      // Comprehensive target object with all commonly used properties
      target: {
        // Form input properties
        name: e.target.name,
        id: e.target.id,
        value: inputValue,
        type: e.target.type,
        placeholder: e.target.placeholder,
        disabled: e.target.disabled,
        readOnly: e.target.readOnly,
        required: e.target.required,
        maxLength: e.target.maxLength,
        autoComplete: e.target.autoComplete,

        // Form properties
        form: e.target.form,

        // Selection properties (for text inputs)
        selectionStart: e.target.selectionStart,
        selectionEnd: e.target.selectionEnd,
        selectionDirection: e.target.selectionDirection,

        // Validation properties
        validity: e.target.validity,
        validationMessage: e.target.validationMessage,
        willValidate: e.target.willValidate,

        // Style and dimension properties
        className: e.target.className,
        classList: e.target.classList,
        style: e.target.style,
        offsetWidth: e.target.offsetWidth,
        offsetHeight: e.target.offsetHeight,
        clientWidth: e.target.clientWidth,
        clientHeight: e.target.clientHeight,

        // Position properties
        offsetLeft: e.target.offsetLeft,
        offsetTop: e.target.offsetTop,
        clientLeft: e.target.clientLeft,
        clientTop: e.target.clientTop,

        // DOM properties
        tagName: e.target.tagName,
        nodeName: e.target.nodeName,
        ownerDocument: e.target.ownerDocument,
        parentElement: e.target.parentElement,
        parentNode: e.target.parentNode,
        children: e.target.children,
        firstChild: e.target.firstChild,
        lastChild: e.target.lastChild,
        nextSibling: e.target.nextSibling,
        previousSibling: e.target.previousSibling,

        // Attribute methods
        getAttribute: e.target.getAttribute.bind(e.target),
        setAttribute: e.target.setAttribute.bind(e.target),
        hasAttribute: e.target.hasAttribute.bind(e.target),
        removeAttribute: e.target.removeAttribute.bind(e.target),

        // Class methods
        addEventListener: e.target.addEventListener.bind(e.target),
        removeEventListener: e.target.removeEventListener.bind(e.target),
        dispatchEvent: e.target.dispatchEvent.bind(e.target),

        // Focus methods
        focus: e.target.focus.bind(e.target),
        blur: e.target.blur.bind(e.target),

        // Selection methods (for text inputs)
        select: e.target.select.bind(e.target),
        setSelectionRange: e.target.setSelectionRange.bind(e.target),

        // Validation methods
        checkValidity: e.target.checkValidity.bind(e.target),
        reportValidity: e.target.reportValidity.bind(e.target),
        setCustomValidity: e.target.setCustomValidity.bind(e.target)
      },

      // Also include currentTarget for consistency
      currentTarget: {
        // Include the most commonly used properties from target
        name: e.currentTarget.name,
        id: e.currentTarget.id,
        value: inputValue,
        type: e.currentTarget.type
      }
    };

    onChange(result);
  };

  return (
    <>
      <div
        className={`Wrapper`}>
        {label && <label className={`Wrapper__label ${isRequired ? 'required-label' : ""}`}>{label}</label>}

        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className={className}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
      {isError &&
        <span className="text-sm text-[#9b0000] mt-1 ms-1">
          {isError}
        </span>
      }
    </>
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
  className
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
        className={className}
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
