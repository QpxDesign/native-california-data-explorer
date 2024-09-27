import { createSlice } from '@reduxjs/toolkit'

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    value: [36.7783, -119.4179, 5], // form: [lat, long, zoom]
  },
  reducers: {
    navigateTo: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { navigateTo } = mapSlice.actions

export default mapSlice.reducer
