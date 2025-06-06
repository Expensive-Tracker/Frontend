import { Budget } from "@/util/interface/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Budget = {
  budgetAmount: 0,
  month: "",
  category: [],
  _id: "",
  totalRemain: 0,
  totalSpent: 0,
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    handleSetBudget: (state, action: PayloadAction<Budget>) => {
      return action.payload;
    },
  },
});

export const { handleSetBudget } = budgetSlice.actions;
const budgetSliceReducer = budgetSlice.reducer;
export default budgetSliceReducer;
