import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamsAPI } from '../../services/api';

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

interface TeamsState {
  teams: Team[];
  selectedTeam: Team | null;
  teamMembers: any[];
  teamResources: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  selectedTeam: null,
  teamMembers: [],
  teamResources: [],
  loading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk('teams/fetchAll', async () => {
  return await teamsAPI.getAll();
});

export const createTeam = createAsyncThunk(
  'teams/create',
  async (teamData: { name: string; description: string }) => {
    return await teamsAPI.create(teamData);
  }
);

export const addTeamMember = createAsyncThunk(
  'teams/addMember',
  async ({ teamId, userIds }: { teamId: string; userIds: string[] }) => {
    return await teamsAPI.addUsers(teamId, userIds);
  }
);

export const removeTeamMember = createAsyncThunk(
  'teams/removeMember',
  async ({ teamId, userId }: { teamId: string; userId: string }) => {
    await teamsAPI.removeUser(teamId, userId);
    return { teamId, userId };
  }
);

export const fetchTeamResources = createAsyncThunk(
  'teams/fetchResources',
  async (teamId: string) => {
    return await teamsAPI.getResources(teamId);
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
      state.teamMembers = [];
      state.teamResources = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(fetchTeamResources.fulfilled, (state, action) => {
        state.teamResources = action.payload;
      });
  },
});

export const { clearSelectedTeam } = teamsSlice.actions;
export default teamsSlice.reducer;
