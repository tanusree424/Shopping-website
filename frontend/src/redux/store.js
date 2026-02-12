import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./Slices/CategorySlice";
import allCategoryReducer from "./Slices/AllCategoriesSlice";
import cartReducer from"./Slices/CartSlice"
import allProductReducer from "./Slices/ProductsSlice"
export const store = configureStore({
    reducer: {
        categories: categoryReducer,
        allCategories: allCategoryReducer,
        carts:cartReducer,
        allProducts:allProductReducer
    },
    devTools:true
})

