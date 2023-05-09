import { configureStore } from "@reduxjs/toolkit";
import { filemanagerAPI } from "./api/filemanagerAPi";


// create the store with the persisted reducer
const store = configureStore({
  reducer: {
    [filemanagerAPI.reducerPath]: filemanagerAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(filemanagerAPI.middleware),
});
export default store
