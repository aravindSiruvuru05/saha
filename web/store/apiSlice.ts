// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UUID } from 'crypto';
import { setUser } from './userSlice';
import { IPlaceDetails } from '@/utils/google_places';

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
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  photo?: string;
}

export enum IUserRole {
  ADMIN,
  MEMBER,
}

export interface IUserResult extends IWithID {
  name: string;
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
console.log(
  process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:8080/',
);
// Define your API slice
export const apiSlice = createApi({
  reducerPath: 'api', // The key for the API reducer
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_NODE_ENV === 'production'
        ? 'http://18.220.173.163:8080/'
        : 'http://localhost:8080/',
    prepareHeaders: async headers => {
      const authorizationHeaders = await prepareAuthorizationHeader();
      Object.entries(authorizationHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return headers;
    },
  }), // Your base URL
  endpoints: builder => ({
    // getPosts: builder.query<Post[], void>({
    //   query: () => 'signin', // The endpoint for fetching posts
    // }),
    // getPostById: builder.query<Post, number>({
    //   query: id => `posts/${id}`, // Fetch a single post by ID
    // }),
    signin: builder.mutation<
      IApiResponse<ISigninResult>,
      Partial<ISigninPayload>
    >({
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
        return rawRes;
      },
    }),
    signup: builder.mutation<IApiResponse<ISignupResult>, ISignupPayload>({
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
        return rawRes;
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
  usePlaceDetailsQuery,
} = apiSlice;
