import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./Slices/CategorySlice";

export const store = configureStore({
    reducer: {
        categories: categoryReducer
    },
    devTools:true
})

