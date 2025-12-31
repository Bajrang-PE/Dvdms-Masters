import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedContract: 1,
  contractList: [],
};

const rateContractASMSlice = createSlice({
  name: "rateContractASM",
  initialState,
  reducers: {
    setSelectedContract(state, action) {
      state.selectedContract = action.payload;
    },
    setContractList(state, action) {
      state.contractList = action.payload;
    },
  },
});

export const { setSelectedContract, setContractList } =
  rateContractASMSlice.actions;
export default rateContractASMSlice.reducer;
