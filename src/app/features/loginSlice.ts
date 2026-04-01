import axiosInstance from "@/api/axios.config";
import type { IUserData } from "@/interfaces";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { toaster } from "@/components/ui/toaster";
import CookieService from "@/services/CookieService";

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
          const date: Date = new Date();
          const IN_DAYS = 3;
          const EXPIRE_IN_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS;
          date.setTime(date.getTime() + EXPIRE_IN_DAYS);
          const options = { path: "/", expires: date };
          CookieService.set("jwt", action.payload.jwt, options);
          toaster.create({
            title: "Login successful",
            type: "success",
            closable: true,
          });
        },
      )
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.data = { user: null, jwt: null };
        state.error = action.payload ?? "Login failed";
        toaster.create({
          title: state.error,
          type: "error",
          closable: true,
        });
      });
  },
});

export const selectLogin = (state: { login: ILoginState }) => state.login;
export default loginSlice.reducer;
