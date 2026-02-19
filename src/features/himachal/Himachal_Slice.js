import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  storeID: {},
  contractDetails: {},
  supplierList: [],
  drugsList: [],
};

const himachalMstSlice = createSlice({
  name: 'himachalMst',
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
  himachalMstSlice.actions;
export default himachalMstSlice.reducer;
