import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBankID: '',
  selectedBankName: '',
};

const branchMasterSlice = createSlice({
  name: 'bankBranchMaster',
  initialState,
  reducers: {
    setBank(state, action) {
      state.selectedBankID = action.payload.id;
      state.selectedBankName = action.payload.name;
    },
  },
});

export const { setBank } = branchMasterSlice.actions;
export default branchMasterSlice.reducer;
