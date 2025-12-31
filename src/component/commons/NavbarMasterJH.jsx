import {
  faPlus,
  faFilter,
  faEdit,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import Popup from './Popup';
import { useDispatch, useSelector } from 'react-redux';
import { showPopup } from '../../features/commons/popupSlice';

export default function NavbarMasterJH({
  label,
  optionsParams,
  children,
  dataTableRef,
  //eslint-disable-next-line
  AddForm,
  //eslint-disable-next-line
  ModifyForm,
  //eslint-disable-next-line
  ViewForm,
  deleteFunction,
  isLargeDataset = false,
  columns = [],
  onAdd
}) {
  //redux states
  const isVisible = useSelector(state => state.popup.isVisible);
  const dispatch = useDispatch();


  //local states
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState('');
  const [isModificationOptionsVisible, setIsModificationOptionsVisible] =
    useState(false);
  const [userSelection, setUserSelection] = useState('');

  //refs to prevent unecessary re renders
  const prevVisibleRef = useRef(false);

  function handleFilterClick() {
    setIsFiltersVisible(prevState => !prevState);
  }

  const handleAddClick = async () => {

    if (onAdd) {
      const isAdd = await onAdd();
      if (isAdd) {
        setUserSelection('Add');
        dispatch(showPopup());
      }
    } else {
      setUserSelection('Add');
      dispatch(showPopup());
    }
  }

  function handleModifyClick() {
    setUserSelection('Modify');
    dispatch(showPopup());
  }

  function handleView() {
    setUserSelection('View');
    dispatch(showPopup());
  }

  function activeForm() {
    switch (userSelection) {
      case 'Add':
        return <AddForm data={dataTableRef?.current?.getSelectedRowsData()} openPage={'Add'} optionsParams={optionsParams} />;
      case 'Modify':
        return (
          <ModifyForm data={dataTableRef?.current?.getSelectedRowsData()} openPage={'Modify'} optionsParams={optionsParams} />
        );
      case 'View':
        return <ViewForm data={dataTableRef?.current?.getSelectedRowsData()} columns={columns} openPage={'View'} />;
    }
  }

  useEffect(() => {
    const formatted = Object.entries(optionsParams)
      .map(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        return `${label}: ${value}`;
      })
      .join(', ');
    setFilterOptions(formatted);
  }, [optionsParams]);

  //  Check selected rows periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (dataTableRef?.current?.getSelectedRowsData) {
        const selectedRows = dataTableRef.current.getSelectedRowsData();
        const newValue = selectedRows.length > 0;

        if (prevVisibleRef.current !== newValue) {
          setIsModificationOptionsVisible(newValue);
          prevVisibleRef.current = newValue;
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [dataTableRef]);

  async function handleDelete() {
    deleteFunction(dataTableRef?.current?.getSelectedRowsData());
  }

  return (
    <>
      <Popup isVisible={isVisible} largeDataset={isLargeDataset}>
        {activeForm()}
      </Popup>

      <div className="masters__navbar">
        <div className="masters__navbar--control-panel">
          <p className="masters__navbar--text">{label}</p>
          <div className="masters__navbar--btn-container">
            {!isModificationOptionsVisible ? (
              <>
                <button
                  className="masters__navbar--btn-container-button"
                  onClick={handleAddClick}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Add
                </button>

                <button
                  className="masters__navbar--btn-container-button masters__navbar--btn-container-button-filter"
                  onClick={handleFilterClick}
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Filter
                </button>
              </>
            ) : (
              // Here add the extra condition
              dataTableRef?.current?.getSelectedRowsData().length === 1 && (
                <>
                  <button
                    className="masters__navbar--btn-container-button masters__navbar--btn-container-button-modify"
                    onClick={handleModifyClick}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Modify
                  </button>

                  <button
                    className="masters__navbar--btn-container-button masters__navbar--btn-container-button-delete"
                    onClick={handleDelete}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Delete
                  </button>
                  <button
                    className="masters__navbar--btn-container-button masters__navbar--btn-container-button-view"
                    onClick={handleView}
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      style={{ marginRight: '0.5rem' }}
                    />
                    View
                  </button>
                </>
              )
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <motion.div
          className="masters__navbar--filters"
          initial={false}
          animate={{
            opacity: isFiltersVisible ? 1 : 0,
            height: isFiltersVisible ? 'auto' : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>

        {/* Filter Summary */}
        <motion.div
          className="masters__navbar--filters"
          initial={false}
          animate={{
            opacity: isFiltersVisible ? 0 : 1,
            height: isFiltersVisible ? 0 : 'auto',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <p className="masters__navbar--filters-summary">{filterOptions}</p>
        </motion.div>
      </div>
    </>
  );
}
