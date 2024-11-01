import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IAcceptRideReqQuery,
  ICancelRideReqQuery,
  ICreateRideReqBody,
  ISearchRidesReqQuery,
  ISearchRidesRes,
  IGetRideReqQuery,
  IJoinRideReqQuery,
  IRide,
  IRideRequestResponse,
  IDeclineRideReqQuery,
  RideSearchState as IRideSearchState,
} from '../../shared/types/rides';
import { baseQueryWithReauth } from '@/utils/api';
import { IPlaceDetails } from '../../shared/types/google_place';
import { IPost } from '../../shared/types/post';
import { IApiRes } from '../../shared/types';

const initialState: IRideSearchState = {};

export const ridesStateSlice = createSlice({
  name: 'rides-state',
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

export const ridesAPISlice = createApi({
  reducerPath: 'rides-api', // The key for the API reducer
  baseQuery: baseQueryWithReauth, // Your base URL
  endpoints: builder => ({
    createRide: builder.mutation<IPost<IRide>, ICreateRideReqBody>({
      query: data => ({
        url: 'api/v1/rides',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiRes<IPost<IRide>>) => {
        return rawRes.data;
      },
    }),
    joinRide: builder.mutation<IRideRequestResponse, IJoinRideReqQuery>({
      query: data => ({
        url: `api/v1/rides/${data.rideID}/join`,
        method: 'POST',
      }),
      transformResponse: (rawRes: IApiRes<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    cancelRide: builder.mutation<IRideRequestResponse, ICancelRideReqQuery>({
      query: data => ({
        url: `api/v1/rides/requests/${data.requestID}/cancel`,
        method: 'POST',
      }),
      transformResponse: (rawRes: IApiRes<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    acceptRequest: builder.mutation<IRideRequestResponse, IAcceptRideReqQuery>({
      query: data => ({
        url: `api/v1/rides/requests/${data.requestID}/accept`,
        method: 'POST',
      }),
      transformResponse: (rawRes: IApiRes<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    declineRequest: builder.mutation<
      IRideRequestResponse,
      IDeclineRideReqQuery
    >({
      query: data => ({
        url: `api/v1/rides/requests/${data.requestID}/decline`,
        method: 'POST',
      }),
      transformResponse: (rawRes: IApiRes<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    searchRides: builder.query<ISearchRidesRes, ISearchRidesReqQuery>({
      query: params => ({
        url: 'api/v1/rides/search',
        params,
      }),
      transformResponse: (rawRes: IApiRes<ISearchRidesRes>) => {
        return rawRes.data;
      },
    }),
    pendingRequests: builder.query<IRideRequestResponse[], any>({
      query: () => ({
        url: 'api/v1/rides/requests/pending/received',
      }),
      transformResponse: (rawRes: IApiRes<IRideRequestResponse[]>) => {
        return rawRes.data;
      },
    }),
    getRideByID: builder.query<IPost<IRide>, IGetRideReqQuery>({
      query: ({ id }) => ({
        url: `api/v1/rides/${id}`,
      }),
      transformResponse: (rawRes: IApiRes<IPost<IRide>>) => {
        return rawRes.data;
      },
    }),
    getMyRides: builder.query<ISearchRidesRes['rides'], any>({
      query: () => ({
        url: `api/v1/rides/my-rides`,
      }),
      transformResponse: (
        rawRes: IApiRes<Omit<ISearchRidesRes, 'fromLocation' | 'toLocation'>>,
      ): ISearchRidesRes['rides'] => {
        return rawRes.data.rides;
      },
    }),
  }),
});

export const { setFromLocation, setToLocation, setRideDate, resetRideSearch } =
  ridesStateSlice.actions;

export const {
  useSearchRidesQuery,
  useGetMyRidesQuery,
  useGetRideByIDQuery,
  useAcceptRequestMutation,
  usePendingRequestsQuery,
  useDeclineRequestMutation,
  useCancelRideMutation,
  useJoinRideMutation,
  useCreateRideMutation,
} = ridesAPISlice;
