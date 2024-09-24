import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice";
import { uiSlice } from "./features/ui/uiSlice";
import { journalSlice } from "./features/journal/journalSlice";



export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        ui: uiSlice.reducer,
        journal: journalSlice.reducer
    }
})