import axiosInstance from "../../api/axios.config";
import type { IUserData } from "@/interfaces";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface IResponseData {
  user: IUserData | null;
  jwt: string | null;
}

interface ILoginState {
  loading: boolean;
  error: string | null;
  data: IResponseData | null;
}

const initialState: ILoginState = {
  loading: false,
  error: null,
  data: {
    user: null,
    jwt: null,
  },
};

export const userLogin = createAsyncThunk<
  IResponseData,
  { identifier: string; password: string },
  { rejectValue: string }
>("login/userLogin", async (user, { rejectWithValue }) => {
  console.log(user);
  try {
    const { data } = await axiosInstance.post("auth/local", user);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        userLogin.fulfilled,
        (state, action: PayloadAction<IResponseData>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        },
      )
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.data = { user: null, jwt: null };
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const selectLogin = (state: { login: ILoginState }) => state.login;
export default loginSlice.reducer;
