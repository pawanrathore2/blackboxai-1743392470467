import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

// Async thunk for admin dashboard stats
export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getDashboardStats();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for student dashboard data
export const getStudentDashboardData = createAsyncThunk(
  'dashboard/getStudentData',
  async (studentId, { rejectWithValue }) => {
    try {
      return await dashboardService.getStudentDashboard(studentId);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  stats: null,
  studentData: null,
  isLoading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.stats = null;
      state.studentData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Admin stats reducers
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Student data reducers
      .addCase(getStudentDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStudentDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentData = action.payload.data;
      })
      .addCase(getStudentDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;