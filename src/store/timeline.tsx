import { createSlice } from '@reduxjs/toolkit'

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    value: 1590, // year
  },
  reducers: {
    setYear: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setYear } = timelineSlice.actions

export default timelineSlice.reducer
