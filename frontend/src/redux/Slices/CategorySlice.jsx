import {createAsyncThunk , createSlice} from "@reduxjs/toolkit"
import api from "../../Pages/Api/Api"

export const fetchCategories = createAsyncThunk(
    "categories/fetch",
    async () =>{
        const response = await api.get("/api/categories");
       // console.log(response.data)
        return response.data
    }
)

const categorySlice =  createSlice({
    name:"categories",
    initialState:{
        categories:[],
        loading:false,
        error:null

    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCategories.pending , (state)=>{
            state.loading = true;
        })
        .addCase(fetchCategories.fulfilled , (state, action)=>{
            state.loading = false,
            state.categories = action.payload.data
        })

        .addCase(fetchCategories.rejected, (state,action)=>{
            state.loading = false,
            state.error = action.error.message
        })
    }
});

export default categorySlice.reducer;