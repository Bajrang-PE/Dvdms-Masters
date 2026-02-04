import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  storeID: {},
  contractDetails: {},
  supplierList: [],
  drugsList: [],
};

const rateContractJHKSlice = createSlice({
  name: 'rateContractJHK',
  initialState,
  reducers: {
    setStore(state, action) {
      state.storeID = action.payload;
    },
    setSupplierData(state, action) {
      state.supplierList = action.payload;
    },
    setContractDetails(state, action) {
      state.contractDetails = action.payload;
    },
    setDrugsList(state, action) {
      state.drugsList = action.payload;
    },
  },
});

export const { setStore, setSupplierData, setContractDetails, setDrugsList } =
  rateContractJHKSlice.actions;
export default rateContractJHKSlice.reducer;
