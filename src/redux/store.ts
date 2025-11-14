import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import teamsReducer from './slices/teamsSlice';
import resourcesReducer from './slices/resourcesSlice';
import keysReducer from './slices/keysSlice';
import permissionsReducer from './slices/permissionsSlice';
import logsReducer from './slices/logsSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    teams: teamsReducer,
    resources: resourcesReducer,
    keys: keysReducer,
    permissions: permissionsReducer,
    logs: logsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
