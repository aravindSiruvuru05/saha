// src/store/apiSlice.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/utils/api';
import { IApiRes } from '../../shared/types';
import { IDistanceRes, IPlaceDetails } from '../../shared/types/google_place';

export const googlePlacesAPISlice = createApi({
  reducerPath: 'google-places-api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    distanceDetails: builder.query({
      query: ({ originPlaceID, destinationPlaceID }) => ({
        url: 'api/v1/google/distance-matrix',
        params: {
          origins: originPlaceID,
          destinations: destinationPlaceID,
        },
      }),
      transformResponse: (rawRes: IApiRes<IDistanceRes>) => {
        return rawRes.data;
      },
    }),
    placeDetails: builder.query({
      query: ({ id }) => ({
        url: 'api/v1/google/places',
        params: {
          id: id,
        },
      }),
      transformResponse: (rawRes: IApiRes<IPlaceDetails>) => {
        return rawRes.data;
      },
    }),
  }),
});

export const {
  useLazyDistanceDetailsQuery,
  useDistanceDetailsQuery,
  useLazyPlaceDetailsQuery,
} = googlePlacesAPISlice;
