import { faFilter, faPlus, faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//eslint-disable-next-line
import { motion } from "framer-motion";
import Popup from "./Popup";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

export default function ServiceNavbar({
  heading,
  buttons,
  children,
  componentsList,
  isLargeDataset,
  userSelection,
  filtersVisibleOnLoad = false,
}) {
  const [isFiltersVisible, setIsFiltersVisible] =
    useState(filtersVisibleOnLoad);
  const isVisible = useSelector((state) => state.popup.isVisible);

  const handleFilterClick = () => {
    setIsFiltersVisible((prev) => !prev);
  };

  // Build dictionary only when componentsList changes
  const SelectedComponent = useMemo(() => {
    const dictionary = Object.fromEntries(
      componentsList.map((item) => [item.mappingKey, item.componentName])
    );
    return dictionary[userSelection];
  }, [componentsList, userSelection]);

  return (
    <>
      <Popup isVisible={isVisible} largeDataset={isLargeDataset}>
        {SelectedComponent && <SelectedComponent />}
      </Popup>

      <div className="masters__navbar">
        <div className="masters__navbar--control-panel">
          <p className="masters__navbar--text">{heading}</p>

          <div className="service__navbar--btn-container">
            {buttons.map((data, index) => (
              <button
                className="masters__navbar--btn-container-button"
                onClick={data.onClick}
                key={index}
                style={{ background: data?.color && data?.color }}
              >
                {data?.icon ? data?.icon :  <FontAwesomeIcon icon={faPlus} className="mr-1" />}
               
                {data.label}
              </button>
            ))}

            <button
              className="masters__navbar--btn-container-button masters__navbar--btn-container-button-filter"
              onClick={handleFilterClick}
            >
              <FontAwesomeIcon
                icon={faFilter}
                style={{ marginRight: "0.5rem" }}
              />
              Filter
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <motion.div
          className="service__navbar--filters"
          initial={false}
          animate={{
            opacity: isFiltersVisible ? 1 : 0,
            height: isFiltersVisible ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
