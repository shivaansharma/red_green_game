import { createSlice } from "@reduxjs/toolkit";

const initial = {
    green : false,
    red : false
}

export const changeColorSlice = createSlice({
    name : 'color',
    initialState : initial,
    reducers:{
        RED : (state,action)=>{
          
            state.green=false;
            state.red = true;
            
        },
        GREEN : (state,action)=>{
            state.green=true;
            state.red = false;
        }
    }
})
export const {RED,GREEN}=changeColorSlice.actions

export default changeColorSlice.reducer 