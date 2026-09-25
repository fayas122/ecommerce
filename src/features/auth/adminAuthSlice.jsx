import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  isAdminAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState,

  reducers: {
    adminLogin: (state, action) => {
      state.admin = action.payload;
      state.isAdminAuthenticated = true;
    },

    adminLogout: (state) => {
      state.admin = null;
      state.isAdminAuthenticated = false;
    },

    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAdminAuthenticated = !!action.payload;
    },
  },
});

export const {
  adminLogin,
  adminLogout,
  setAdmin,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;