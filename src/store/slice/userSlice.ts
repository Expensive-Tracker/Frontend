import { userSliceState } from "@/util/interface/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userSliceState = {
  userDetail: {
    username: "",
    password: "",
    email: "",
    _id: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleLogin: (
      state,
      action: PayloadAction<userSliceState["userDetail"]>
    ) => {
      state.userDetail = action.payload;
    },
    handleChangeUserData: (state, action) => {
      state.userDetail = {
        ...action.payload,
        password: state.userDetail.password,
      };
    },
    handleChangePassword: (state, action) => {
      state.userDetail = {
        ...state.userDetail,
        password: action.payload,
      };
    },
  },
});

export const { handleLogin, handleChangePassword, handleChangeUserData } =
  userSlice.actions;
const userSliceReducer = userSlice.reducer;

export default userSliceReducer;
