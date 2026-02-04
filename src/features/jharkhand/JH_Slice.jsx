import { createSlice } from '@reduxjs/toolkit';
import { createAsyncReducers } from '../asyncReducer';
import { fetchBankBranchList, fetchBankList, fetchBankNameDrpDt } from './JH_Apis';

const initialState = {
  bankMstDt: [],
  bankNameDrpDt: [],
  bankBranchMstDt: [],
  error: null,
  supplierID: {},
};

const jhMasters = createSlice({
  name: 'jhMst',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSupplier(state, action) {
      state.supplierID = action.payload;
    },
  },
  extraReducers: createAsyncReducers([
    { thunk: fetchBankList, stateKey: 'bankMstDt' },
    { thunk: fetchBankNameDrpDt, stateKey: 'bankNameDrpDt' },
    { thunk: fetchBankBranchList, stateKey: 'bankBranchMstDt' },
  ])
});

export const { clearError, setSupplier } = jhMasters.actions;
export { fetchBankList, fetchBankNameDrpDt, fetchBankBranchList };
export default jhMasters.reducer;