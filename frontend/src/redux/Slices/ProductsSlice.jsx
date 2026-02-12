import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Pages/Api/Api";

export const fetchProducts = createAsyncThunk(
    "fetch/products",
    async (params = {}) => {
        try {
            const query = new URLSearchParams(params).toString()

        // যদি filter থাকে → filter-products
        const url = Object.keys(params).length > 1
            ? `/api/filter-products?${query}`
            : `/api/products?page=${query}`

        const response = await api.get(url)


        return response.data 
        } catch (error) {
            console.log(error?.response?.data?.message||error?.message)
        }

        // params = { page, min_price, max_price, color, size }

       
    }
)


const allProductsSlice = createSlice({
    name: "allProducts",
    initialState: {
        allProducts: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.allProducts = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default allProductsSlice.reducer;
