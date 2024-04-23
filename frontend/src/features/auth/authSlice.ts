import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        loggedInUser: null, // Initially, no user is logged in
    },
    reducers: {
        saveLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        clearLoggedInUser: (state) => {
            state.loggedInUser = null;
        },
    },
});

export const { saveLoggedInUser, clearLoggedInUser } = authSlice.actions;

// Thunk action creator to fetch user data from API



export default authSlice.reducer;
