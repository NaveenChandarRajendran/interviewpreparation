import { configureStore } from "@reduxjs/toolkit";
import rootReducers from "./slice";

const store = configureStore({
    reducer:rootReducers
})

export default store;