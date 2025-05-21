import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./slice/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";
import themeSliceReduce from "./slice/themeSlice";
import uiSliceReducer from "./slice/uiSlice";

const rootReducer = combineReducers({
  user: userSliceReducer,
  theme: themeSliceReduce,
  uiSlice: uiSliceReducer,
});

const key = "user Data";

const persistConfiguration = {
  key,
  storage,
};

const persistRootReducer = persistReducer(persistConfiguration, rootReducer);

const store = configureStore({
  reducer: persistRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistStored = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
