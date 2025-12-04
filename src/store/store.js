import { configureStore } from '@reduxjs/toolkit';
import popupReducer from '../features/commons/popupSlice';
import branchMasterReducer from '../features/BankBranchMaster/bankBranchMasterSlice';
import rateContractJHKReducer from '../features/Ratecontract/rateContractJHKSlice';

const store = configureStore({
  reducer: {
    popup: popupReducer,
    bankBranchMaster: branchMasterReducer,
    rateContractJHK: rateContractJHKReducer,
  },
});

export default store;
