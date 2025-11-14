import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { keysAPI } from '../../services/api';

interface Key {
  id: string;
  name: string;
  type: 'ssh' | 'api';
  fingerprint: string;
  createdAt: string;
  lastUsed?: string;
}

interface KeysState {
  keys: Key[];
  loading: boolean;
  error: string | null;
}

const initialState: KeysState = {
  keys: [],
  loading: false,
  error: null,
};

export const fetchKeys = createAsyncThunk('keys/fetchAll', async () => {
  return await keysAPI.getAll();
});

export const createKey = createAsyncThunk(
  'keys/create',
  async (keyData: { name: string; type: string; publicKey?: string }) => {
    return await keysAPI.create(keyData);
  }
);

export const deleteKey = createAsyncThunk('keys/delete', async (id: string) => {
  await keysAPI.delete(id);
  return id;
});

const keysSlice = createSlice({
  name: 'keys',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.keys = action.payload;
      })
      .addCase(fetchKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch keys';
      })
      .addCase(createKey.fulfilled, (state, action) => {
        state.keys.push(action.payload);
      })
      .addCase(deleteKey.fulfilled, (state, action) => {
        state.keys = state.keys.filter((k) => k.id !== action.payload);
      });
  },
});

export default keysSlice.reducer;
