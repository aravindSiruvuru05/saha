import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISigninResult, IUserRole } from './types';

// Define the initial state for the user
interface UserState {
  name: string;
  email: string;
  token: string;
  role: IUserRole | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  name: '',
  email: '',
  token: '',
  role: null,
  isLoggedIn: false,
};

// Create the user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to store user data
    setUser: (state, action: PayloadAction<ISigninResult>) => {
      const { token, user } = action.payload;
      state.name = user.name;
      state.email = user.email;
      state.token = token;
      state.isLoggedIn = true;
    },
    // Action to clear user data (for logout)
    clearUser: state => {
      state.name = '';
      state.email = '';
      state.token = '';
      state.isLoggedIn = false;
    },
  },
});

// Export the action creators
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
