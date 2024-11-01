// src/store/apiSlice.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/utils/api';
import { IApiRes } from '../../shared/types';
import {
  ISigninPayload,
  ISigninRes,
  ISignupPayload,
  ISignupRes,
} from '../../shared/types/auth';

// Define your API slice
export const authSlice = createApi({
  reducerPath: 'api', // The key for the API reducer
  baseQuery: baseQueryWithReauth, // Your base URL
  endpoints: builder => ({
    signin: builder.mutation<ISigninRes, Partial<ISigninPayload>>({
      query: data => ({
        url: 'api/v1/auth/signin',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiRes<ISigninRes>) => {
        const { token, user } = rawRes.data;
        if (token) {
          localStorage.setItem('AccessToken', token);
        }
        return rawRes.data;
      },
    }),
    signup: builder.mutation<ISignupRes, ISignupPayload>({
      query: data => ({
        url: 'api/v1/auth/signup',
        method: 'POST',
        body: data,
      }),
      transformResponse: (rawRes: IApiRes<ISignupRes>) => {
        const token = rawRes.data.token;
        if (token) {
          localStorage.setItem('AccessToken', token);
        }
        return rawRes.data;
      },
    }),
  }),
});

export const { useSigninMutation, useSignupMutation } = authSlice;
