import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    apiData: null,
    isRequesting: false
}

export const getVehicles = createAsyncThunk('starwarVehicle', async () => {
    const response = await fetch("https://swapi.dev/api/vehicles/");
    const vehicles = await response.json();
    return vehicles;
})

const starWarSlice = createSlice({
    initialState,
    name: 'starWarSlice',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getVehicles.pending, (state, action) => {
            state.isRequesting = true
        }).addCase(getVehicles.fulfilled, (state, action) => {
            state.isRequesting = false;
            state.apiData = action.payload;
        }).addCase(getVehicles.rejected, (state) => {
            state.isRequesting = false
        })
    }
})

const starWarReducer = starWarSlice.reducer;

export default starWarReducer;