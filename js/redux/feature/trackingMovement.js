import { createSlice } from "@reduxjs/toolkit";

const initial = {
  rightLeg: {
    rightHip: { x: 0, y: 0, score: 0 },
    rightAnkle: { x: 0, y: 0, score: 0 }
  },
  leftLeg: {
    leftHip: { x: 0, y: 0, score: 0 },
    leftAnkle: { x: 0, y: 0, score: 0 }
  }
};

export const trackMovement = createSlice({
  name: "Legs",
  initialState: initial,
  reducers: {
    updateLegs: (state, action) => {
      state.rightLeg = action.payload.rightLeg;
      state.leftLeg = action.payload.leftLeg;
    }
  }
});

export const { updateLegs } = trackMovement.actions;
export default trackMovement.reducer;