import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
/* import cartItems from "../../cartItems"; */
import axios from 'axios';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems: [],
    amount: [],
    total: 0,
    isLoading: true,
};

export const getCartItems = createAsyncThunk('cart/getCartItems',
    async (name, thunkAPI) => {
        try {
            // console.log(name);
            // console.log(thunkAPI);
            // console.log(thunkAPI.getState());
            // thunkAPI.dispatch(openModal());
            const resp = await axios(url);
            //console.log(resp)
            return resp.data
        }
        catch (error) {
            return thunkAPI.rejectWithValue('something went wrong');
        }
    })

/* export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
    return fetch(url)
        .then(resp => resp.json())
        .catch((err) => console.log(err));
}) */

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            //filter cart Items that only have ids different from the payload id (item to be removed)
            state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
            //console.log(action)
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.id === payload.id)
            cartItem.amount = cartItem.amount + 1;
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.id === payload.id)
            cartItem.amount = cartItem.amount - 1;
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total.toFixed(2);
        },
    },
    extraReducers: {
        [getCartItems.pending]: (state) => {
            state.isLoading = true;
        },
        [getCartItems.fulfilled]: (state, action) => {
            //console.log(action);
            state.isLoading = false;
            state.cartItems = action.payload;
        },
        [getCartItems.pending]: (state, action) => {
            //console.log(action);
            state.isLoading = false;
        },
    },
});

/* console.log(cartSlice); */

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;