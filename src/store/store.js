import { configureStore } from "@reduxjs/toolkit";
import popupReducer from "../features/commons/popupSlice";
import branchMasterReducer from "../features/BankBranchMaster/bankBranchMasterSlice";
import rateContractJHKReducer from "../features/Ratecontract/rateContractJHKSlice";
import rateContractASMReducer from "../features/Ratecontract/rateContractASMSlice";
import jhMstReducers from "../features/jharkhand/JH_Slice";
import himachalMstReducers from "../features/himachal/Himachal_Slice";

const store = configureStore({
  reducer: {
    popup: popupReducer,
    bankBranchMaster: branchMasterReducer,
    rateContractJHK: rateContractJHKReducer,
    rateContractASM: rateContractASMReducer,
    jhMst: jhMstReducers,
    himachalMst:himachalMstReducers
  },
});

export default store;
