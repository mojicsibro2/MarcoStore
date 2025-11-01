// src/modules/cart/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart } from "../api/cartService";

interface CartState {
  cart: Cart | null;
}

const initialState: CartState = {
  cart: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
