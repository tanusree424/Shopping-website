import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import api from "../../Pages/Api/Api";

export const fetchAllCategories = createAsyncThunk(
    "fetch/allCategories",
   async () =>{
        const response = await api.get("/api/categories");
      //  console.log(response.data.categories)
        return response.data.categories
   
});

const allCategorySlice = createSlice({
  name: "allCategories",
  initialState: {
    allCategories: [],   // array initialize করো
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.allCategories = action.payload; // payload assign করো
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default allCategorySlice.reducer;