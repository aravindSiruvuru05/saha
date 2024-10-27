// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { IPlaceDetails } from '@/utils/google_places';
import {
  IAcceptRideRequest,
  ICancelRideRequest,
  ICreateRideRequest,
  ISearchRidesReqQuery,
  ISearchRidesRes,
  IGetRideReqQuery,
  IJoinRideRequest,
  IPost,
  IRide,
  IRideRequestResponse,
} from './types';
import { UUID } from 'crypto';

export interface IDistanceResponse {
  distance: string;
  duration: string;
}

export interface IWithID {
  id: UUID;
}
export interface ISigninPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pic?: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo?: string;
}

export enum IUserRole {
  ADMIN,
  MEMBER,
}

export interface IUserResult extends IWithID {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pic?: string;
  email: string;
  role: IUserRole;
}
export interface ISigninResult {
  token: string;
  user: IUserResult;
}

export interface IApiResponse<T> {
  data: T;
}
export interface ISignupResult {
  token: string;
}

export interface IDistanceResponse {
  distance: string;
  duration: string;
}

export const prepareAuthorizationHeader = (): Record<string, string> => {
  const token = localStorage.getItem('AccessToken');
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

// Utility function for redirection
const redirectToSignIn = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/signin'; // Adjust the path to your sign-in page
  }
};

// Custom base query with error handling for re-authentication
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs, // The type for request arguments
  unknown, // The type for the result
  FetchBaseQueryError // The type for the error
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:8080/',
    prepareHeaders: async headers => {
      const authorizationHeaders = await prepareAuthorizationHeader();
      Object.entries(authorizationHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    !['signin', 'signup'].includes(api.endpoint)
  ) {
    // If 401 Unauthorized, clear the access token and redirect to sign-in
    localStorage.removeItem('AccessToken');
    redirectToSignIn();
  }

  return result;
};

// Define your API slice
export const apiSlice = createApi({
  reducerPath: 'api', // The key for the API reducer
  baseQuery: baseQueryWithReauth, // Your base URL
  endpoints: builder => ({
    // getPosts: builder.query<Post[], void>({
    //   query: () => 'signin', // The endpoint for fetching posts
    // }),
    // getPostById: builder.query<Post, number>({
    //   query: id => `posts/${id}`, // Fetch a single post by ID
    // }),
    signin: builder.mutation<ISigninResult, Partial<ISigninPayload>>({
      query: data => ({
        url: 'api/v1/auth/signin',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<ISigninResult>) => {
        const { token, user } = rawRes.data;
        if (token) {
          localStorage.setItem('AccessToken', token);
        }
        return rawRes.data;
      },
    }),
    signup: builder.mutation<ISignupResult, ISignupPayload>({
      query: data => ({
        url: 'api/v1/auth/signup',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<ISignupResult>) => {
        const token = rawRes.data.token;
        if (token) {
          localStorage.setItem('AccessToken', token);
        }
        return rawRes.data;
      },
    }),
    createPost: builder.mutation<IPost<IRide>, ICreateRideRequest>({
      query: data => ({
        url: 'api/v1/rides',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<IPost<IRide>>) => {
        return rawRes.data;
      },
    }),
    joinRide: builder.mutation<IRideRequestResponse, IJoinRideRequest>({
      query: data => ({
        url: `api/v1/rides/requests/join`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    cancelRide: builder.mutation<IRideRequestResponse, ICancelRideRequest>({
      query: data => ({
        url: `api/v1/rides/requests/cancel`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    acceptRequest: builder.mutation<IRideRequestResponse, IAcceptRideRequest>({
      query: data => ({
        url: 'api/v1/rides/requests/accept',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    declineRequest: builder.mutation<IRideRequestResponse, IAcceptRideRequest>({
      query: data => ({
        url: 'api/v1/rides/requests/decline',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiResponse<IRideRequestResponse>) => {
        return rawRes.data;
      },
    }),
    searchRides: builder.query<ISearchRidesRes, ISearchRidesReqQuery>({
      query: params => ({
        url: 'api/v1/rides/search',
        params,
      }),
      transformResponse: (rawRes: IApiResponse<ISearchRidesRes>) => {
        return rawRes.data;
      },
    }),
    pendingRequests: builder.query<IRideRequestResponse[], any>({
      query: () => ({
        url: 'api/v1/rides/requests/pending/received',
      }),
      transformResponse: (rawRes: IApiResponse<IRideRequestResponse[]>) => {
        return rawRes.data;
      },
    }),
    getRideByID: builder.query<IPost<IRide>, IGetRideReqQuery>({
      query: ({ id }) => ({
        url: `api/v1/rides/${id}`,
      }),
      transformResponse: (rawRes: IApiResponse<IPost<IRide>>) => {
        return rawRes.data;
      },
    }),
    getMyRides: builder.query<ISearchRidesRes['rides'], any>({
      query: () => ({
        url: `api/v1/rides/my-rides`,
      }),
      transformResponse: (
        rawRes: IApiResponse<
          Omit<ISearchRidesRes, 'fromLocation' | 'toLocation'>
        >,
      ): ISearchRidesRes['rides'] => {
        return rawRes.data.rides;
      },
    }),
    distanceDetails: builder.query({
      query: ({ originPlaceID, destinationPlaceID }) => ({
        url: 'api/v1/google/distance-matrix',
        params: {
          origins: originPlaceID,
          destinations: destinationPlaceID,
        },
      }),
      transformResponse: (rawRes: IApiResponse<IDistanceResponse>) => {
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
      transformResponse: (rawRes: IApiResponse<IPlaceDetails>) => {
        return rawRes.data;
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSigninMutation,
  useSignupMutation,
  useLazyDistanceDetailsQuery,
  useDistanceDetailsQuery,
  useLazyPlaceDetailsQuery,
  useSearchRidesQuery,
  useGetMyRidesQuery,
  useGetRideByIDQuery,
  useAcceptRequestMutation,
  usePendingRequestsQuery,
  useDeclineRequestMutation,
  useCancelRideMutation,
  useJoinRideMutation,
  useCreatePostMutation,
} = apiSlice;
