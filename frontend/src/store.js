// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialStationState = { entrances: [], exits: [] };

const stationSlice = createSlice({
  name: "station",
  initialState: initialStationState,
  reducers: {
    setStations: (state, action) => {
      return action.payload;
    },
    updateEntrance: (state, action) => {
      const idx = state.entrances.findIndex(e => e.id === action.payload.id);
      if (idx >= 0) state.entrances[idx] = action.payload;
      else state.entrances.push(action.payload);
    },
    updateExit: (state, action) => {
      const idx = state.exits.findIndex(e => e.id === action.payload.id);
      if (idx >= 0) state.exits[idx] = action.payload;
      else state.exits.push(action.payload);
    }
  },
});

export const { setStations, updateEntrance, updateExit } = stationSlice.actions;

export const store = configureStore({
  reducer: {
    station: stationSlice.reducer,
  },
});