import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

export const prepareAuthorizationHeader = (): Record<string, string> => {
  return {};
};
export const baseApiService = createApi({
  reducerPath: 'api',
  tagTypes: [],
  keepUnusedDataFor: 3600,
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: '/',
      prepareHeaders: async headers => {
        const authorizationHeaders = await prepareAuthorizationHeader();
        Object.entries(authorizationHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
        return headers;
      },
    }),
  ),
  endpoints: () => ({}),
});

export const mutableApiService = createApi({
  reducerPath: 'mutableApi',
  tagTypes: [],
  keepUnusedDataFor: 3600,
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: '/',
      prepareHeaders: async headers => {
        const authorizationHeaders = await prepareAuthorizationHeader();
        Object.entries(authorizationHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
        return headers;
      },
    }),
  ),
  endpoints: () => ({}),
});

export const freezeResult =
  <T, R>(mapper: (input: T) => R) =>
  (input: T) =>
    Object.freeze(mapper(input));
