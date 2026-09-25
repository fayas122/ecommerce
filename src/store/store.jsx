import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import adminAuthReducer from "../features/auth/adminAuthSlice"

export const store = configureStore({
  reducer: {
    adminAuth : adminAuthReducer,
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});