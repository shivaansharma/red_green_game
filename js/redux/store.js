import { configureStore } from '@reduxjs/toolkit';
import changeColorSlice from "./feature/changeColorSlice.js";
import trackingMovement from './feature/trackingMovement.js';
export const store = configureStore({
    reducer :{changeColorSlice,trackingMovement}
});