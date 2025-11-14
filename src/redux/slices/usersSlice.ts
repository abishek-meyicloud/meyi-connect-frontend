import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '../../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  return await usersAPI.getAll();
});

export const fetchUser = createAsyncThunk('users/fetchOne', async (id: string) => {
  return await usersAPI.getById(id);
});

export const createUser = createAsyncThunk(
  'users/create',
  async (userData: { email: string; name: string; password: string; role: string }) => {
    return await usersAPI.create(userData);
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: Partial<User> }) => {
    return await usersAPI.update(id, data);
  }
);

export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
  await usersAPI.delete(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
