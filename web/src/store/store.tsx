import { configureStore } from '@reduxjs/toolkit'
import { mapSlice } from "./map"
import { timelineSlice } from './timeline';

const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
    timeline: timelineSlice.reducer

  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
