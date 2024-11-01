import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
export const baseQueryWithReauth: BaseQueryFn<
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
