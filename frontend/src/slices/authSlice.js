import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserRequest, signupUserRequest } from "../services/authService";
import { getApiErrorMessage } from "../services/api";
import {
  clearStoredAuthTokens,
  getStoredAuthToken,
  setStoredAuthTokens,
} from "../services/tokenStorage";

const getStoredToken = () => {
  return getStoredAuthToken();
};

const initialToken = getStoredToken();

const initialState = {
  user: null,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const payload = await loginUserRequest(credentials);
      setStoredAuthTokens({ token: payload.token, refreshToken: payload.refreshToken });
      return payload;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await signupUserRequest(payload);
      setStoredAuthTokens({ token: data.token, refreshToken: data.refreshToken });
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      clearStoredAuthTokens();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to login. Please try again.";
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to sign up. Please try again.";
      });
  },
});

export const { clearAuthError, logoutUser } = authSlice.actions;
export default authSlice.reducer;
