import { IPlaceDetails } from '@/utils/google_places';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideSearchState {
  fromLocation?: IPlaceDetails;
  toLocation?: IPlaceDetails;
  rideDate?: Date;
}

const initialState: RideSearchState = {};

export const ridesSlice = createSlice({
  name: 'rideSearch',
  initialState,
  reducers: {
    setFromLocation(state, action: PayloadAction<IPlaceDetails | undefined>) {
      state.fromLocation = action.payload;
    },
    setToLocation(state, action: PayloadAction<IPlaceDetails | undefined>) {
      state.toLocation = action.payload;
    },
    setRideDate(state, action: PayloadAction<Date | undefined>) {
      state.rideDate = action.payload;
    },
    resetRideSearch(state) {},
  },
});

export const { setFromLocation, setToLocation, setRideDate, resetRideSearch } =
  ridesSlice.actions;
