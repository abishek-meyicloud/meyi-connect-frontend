import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resourcesAPI } from '../../services/api';

interface Resource {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface ResourcesState {
  resources: Resource[];
  selectedResource: Resource | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResourcesState = {
  resources: [],
  selectedResource: null,
  loading: false,
  error: null,
};

export const fetchResources = createAsyncThunk('resources/fetchAll', async () => {
  return await resourcesAPI.getAll();
});

export const createResource = createAsyncThunk(
  'resources/create',
  async (resourceData: Omit<Resource, 'id' | 'createdAt'>) => {
    return await resourcesAPI.create(resourceData);
  }
);

export const updateResource = createAsyncThunk(
  'resources/update',
  async ({ id, data }: { id: string; data: Partial<Resource> }) => {
    return await resourcesAPI.update(id, data);
  }
);

export const deleteResource = createAsyncThunk('resources/delete', async (id: string) => {
  await resourcesAPI.delete(id);
  return id;
});

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clearSelectedResource: (state) => {
      state.selectedResource = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resources';
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.resources.push(action.payload);
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        const index = state.resources.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.resources[index] = action.payload;
        }
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearSelectedResource } = resourcesSlice.actions;
export default resourcesSlice.reducer;
