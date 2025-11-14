import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logsAPI } from '../../services/api';

interface SessionLog {
  id: string;
  userId: string;
  userName: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  logoutTime?: string;
  status: string;
}

interface CommandLog {
  id: string;
  userId: string;
  userName: string;
  resourceId: string;
  resourceName: string;
  command: string;
  timestamp: string;
  status: string;
}

interface ResourceLog {
  id: string;
  userId: string;
  userName: string;
  resourceId: string;
  resourceName: string;
  action: string;
  timestamp: string;
}

interface LogsState {
  sessions: SessionLog[];
  commands: CommandLog[];
  resources: ResourceLog[];
  loading: boolean;
  error: string | null;
}

const initialState: LogsState = {
  sessions: [],
  commands: [],
  resources: [],
  loading: false,
  error: null,
};

export const fetchSessionLogs = createAsyncThunk('logs/fetchSessions', async () => {
  return await logsAPI.getSessions();
});

export const fetchCommandLogs = createAsyncThunk('logs/fetchCommands', async () => {
  return await logsAPI.getCommands();
});

export const fetchResourceLogs = createAsyncThunk('logs/fetchResources', async () => {
  return await logsAPI.getResources();
});

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessionLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessionLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch session logs';
      })
      .addCase(fetchCommandLogs.fulfilled, (state, action) => {
        state.commands = action.payload;
      })
      .addCase(fetchResourceLogs.fulfilled, (state, action) => {
        state.resources = action.payload;
      });
  },
});

export default logsSlice.reducer;
