import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./Slices/CategorySlice";
import allCategoryReducer from "./Slices/AllCategoriesSlice";

export const store = configureStore({
    reducer: {
        categories: categoryReducer,
        allCategories: allCategoryReducer
    },
    devTools:true
})

