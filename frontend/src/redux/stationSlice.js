// redux/stationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entrances: [],  // <-- important: default to empty array
  exits: [],      // <-- important: default to empty array
  entryCount: 0,
  exitCount: 0,
};

const stationSlice = createSlice({
  name: "station",
  initialState,
  reducers: {
    SET_STATION: (state, action) => {
      state.entrances = action.payload.entrances;
      state.exits = action.payload.exits;
      state.entryCount = action.payload.entryCount;
      state.exitCount = action.payload.exitCount;
    },
  },
});

export const { SET_STATION } = stationSlice.actions;
export default stationSlice.reducer;
