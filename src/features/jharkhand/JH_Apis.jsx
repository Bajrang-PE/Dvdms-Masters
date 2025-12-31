import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../../utils/ApiHook";

export const fetchBankList = createAsyncThunk(
  "jh/fetchBankList",
  async (status, { rejectWithValue }) => {
    try {
      const response = await fetchData(
        `/jhk-masters/api/v1/bank-mst?status=${status}`
      );
      console.log(response?.data);

      if (response?.data?.status === 1) return response.data.data;
      return rejectWithValue(response?.data?.message || "API failed");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchBankNameDrpDt = createAsyncThunk(
  "his/fetchBankNameDrpDt",
  async (status, { rejectWithValue }) => {
    try {
      const response = await fetchData(
        `/jhk-masters/api/v1/bank-mst?status=${status}`
      );

      if (response?.data?.status === 1) {
        const drpDt = response?.data.data?.map((dt, index) => ({
          value: dt?.gnumBankId,
          label: dt?.gstrBankName,
        }));
        return drpDt;
      }
      return rejectWithValue(response?.data?.message || "API failed");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBankBranchList = createAsyncThunk(
  "his/fetchBankBranchList",
  async ({ status, id }, { rejectWithValue }) => {
    try {
      const response = await fetchData(
        `/jhk-masters/api/v1/bank-branch-mst?status=${status}&bankId=${id}`
      );

      if (response?.data?.status === 1) return response.data.data;
      if (response?.data?.status === 0 || response?.data?.data === null) {
        return [];
      }

      return rejectWithValue(response?.data?.message || "API failed");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
