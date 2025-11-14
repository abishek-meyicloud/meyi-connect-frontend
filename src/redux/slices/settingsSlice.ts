import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsAPI } from '../../services/api';

interface Settings {
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  ssoEnabled: boolean;
  auditLogRetention: number;
  maintenanceMode: boolean;
}

interface SettingsState {
  settings: Settings | null;
  ssoProviders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  ssoProviders: [],
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  return await settingsAPI.get();
});

export const updateSettings = createAsyncThunk(
  'settings/update',
  async (settings: Partial<Settings>) => {
    return await settingsAPI.update(settings);
  }
);

export const fetchSSOProviders = createAsyncThunk('settings/fetchProviders', async () => {
  return await settingsAPI.getProviders();
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch settings';
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(fetchSSOProviders.fulfilled, (state, action) => {
        state.ssoProviders = action.payload;
      });
  },
});

export default settingsSlice.reducer;
