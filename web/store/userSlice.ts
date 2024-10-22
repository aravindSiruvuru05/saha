import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISigninResult, IUserRole } from './types';

// Define the initial state for the user
interface UserState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  token: string;
  role: IUserRole | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
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
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.phoneNumber = user.phoneNumber;
      state.email = user.email;
      state.token = token;
      state.isLoggedIn = true;
    },
    // Action to clear user data (for logout)
    clearUser: state => {
      state.firstName = '';
      state.lastName = '';
      state.phoneNumber = '';
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
