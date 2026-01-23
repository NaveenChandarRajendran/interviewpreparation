import { combineSlices } from "@reduxjs/toolkit";
import starWarReducer from "./starwarSlice";

const rootReducers = combineSlices({
    starWar: starWarReducer
})

export default rootReducers;