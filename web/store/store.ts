import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authSlice } from './authSlice';
import { ridesStateSlice, ridesAPISlice } from './ridesSlice';
import { googlePlacesAPISlice } from './googlePlacesSlice';

const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    [ridesStateSlice.reducerPath]: ridesStateSlice.reducer,
    [ridesAPISlice.reducerPath]: ridesAPISlice.reducer,
    [googlePlacesAPISlice.reducerPath]: googlePlacesAPISlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authSlice.middleware,
    ),
});

// Optional: set up listeners for refetching, etc.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
