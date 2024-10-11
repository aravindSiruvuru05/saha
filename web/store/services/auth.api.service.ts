import { freezeResult, mutableApiService } from "./base.api.service";
import { baseApiService } from "./base.api.service"; // Assuming baseApiService is correctly imported

interface IApiResult<T> {
    data: T
}
interface ISignupData {
    token : string
}
// export const authService = mutableApiService.injectEndpoints({
//   endpoints: (build) => ({
//     auth: build.query({
//       query: ({ baseUrl, persona, demoDataEntries }) => ({
//         url: `${baseUrl}/${ReadWorkflows.Contacts}`,
//         method: 'POST',
//         body: updateBodyParams({}, persona, demoDataEntries, getImpersonationID()),
//       }),
//       transformResponse: (rawRes: TContactsAPIResponse) => rawRes.contacts,
//     }),
//   }),
// });


// Create and inject the signup endpoint into the base API service
const signupApiSlice = mutableApiService.injectEndpoints({
    endpoints: (build) => ({
      signup: build.query<IApiResult<ISignupData>, void>({
        query: () => ({
          url: 'api/v1/auth/signup',
          method: 'GET',
        }),
        transformResponse: (rawRes: IApiResult<ISignupData>) => rawRes,
      }),
    }),
    overrideExisting: false,  // Ensure it doesn't conflict with other APIs
  });
  