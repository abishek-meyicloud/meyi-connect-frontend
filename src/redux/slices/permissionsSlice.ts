import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionsAPI } from '../../services/api';

interface Permission {
  id: string;
  resourceId: string;
  resourceName: string;
  subjectType: 'user' | 'team';
  subjectId: string;
  subjectName: string;
  permissions: string[];
  createdAt: string;
}

interface PermissionsState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionsState = {
  permissions: [],
  loading: false,
  error: null,
};

export const fetchPermissions = createAsyncThunk('permissions/fetchAll', async () => {
  return await permissionsAPI.getAll();
});

export const grantPermission = createAsyncThunk(
  'permissions/grant',
  async (permissionData: {
    resourceId: string;
    subjectType: 'user' | 'team';
    subjectId: string;
    permissions: string[];
  }) => {
    return await permissionsAPI.grant(permissionData);
  }
);

export const revokePermission = createAsyncThunk(
  'permissions/revoke',
  async (id: string) => {
    await permissionsAPI.revoke(id);
    return id;
  }
);

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permissions';
      })
      .addCase(grantPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })
      .addCase(revokePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter((p) => p.id !== action.payload);
      });
  },
});

export default permissionsSlice.reducer;
