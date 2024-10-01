import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  clearUserDetails,
  clearUserToken,
  setUserDetails,
  setUserToken,
} from "./userSlice";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api/auth`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          if (data.data.user) {
            dispatch(setUserDetails(data.data.user));
          }
          if (data.data.token) {
            dispatch(setUserToken(data.data.token));
          } else {
            console.error("Token is missing in the response.");
          }
        } catch (error) {
          console.error("Failed to authenticate.", error.message);
        }
      },
    }),
    getUserByEmail: builder.query({
      query: (email) => ({
        url: "/getUserByEmail",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setUserDetails(data.data));
          }
        } catch (error) {
          console.error("Failed to fetch user details.", error.message);
        }
      },
    }),

    // Register user and trigger OTP generation
    registerUserWithOTP: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === true) {
            // Automatically trigger OTP generation
            dispatch(
              authApi.endpoints.generateOTP.initiate({ email: arg.email }) // Assuming email is in userData
            );
          }
        } catch (error) {
          console.error("Failed to register user.", error.message);
        }
      },
    }),

    // Generate OTP (this will be triggered after registration)
    generateOTP: builder.mutation({
      query: (email) => ({
        url: "/generateOtp",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("data1:", data);
        } catch (error) {
          console.error("Problem while generating OTP!", error.message);
        }
      },
    }),
    //  Verify OTP and retrieve user data and token
    verifyOTP: builder.mutation({
      query: ({ email, code }) => ({
        url: "/verifyOTP",
        method: "POST",
        body: { email, code },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.status === true && data.data.user && data.data.token) {
            // Store user details and token
            dispatch(setUserDetails(data.data.user));
            dispatch(setUserToken(data.data.token));
          }
        } catch (error) {
          console.error("Failed to verify OTP.", error.message);
        }
      },
    }),

    // Generate OTP (this will be triggered when forget Password)
    forgetPassword: builder.mutation({
      query: (email) => ({
        url: "/forgetPassword",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("data2:", data);
          await queryFulfilled;
        } catch (error) {
          error.error("Problem while generating OTP!", error.message);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/updateUser",
        method: "POST",
        body: userData,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setUserDetails(data.data));
          }
        } catch (error) {
          console.error("Failed to update profile.", error.message);
        }
      },
    }),
    //  Verify OTP and retrieve user data and token
    checkOTP: builder.mutation({
      query: ({ email, code }) => ({
        url: "/checkOTP",
        method: "POST",
        body: { email, code },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.status === true) {
          }
        } catch (error) {
          console.error("Failed to verify OTP.", error.message);
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ email, newpassword }) => ({
        url: "/resetPassword",
        method: "POST",
        body: { email, newpassword },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to reset password.", error.message);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(clearUserToken());
          dispatch(clearUserDetails());
        } catch (error) {
          console.error("Problem while logout!", error.message);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserByEmailQuery,
  useRegisterUserWithOTPMutation,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useForgetPasswordMutation,
  useCheckOTPMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useLogoutMutation,
} = authApi;

export default authApi;
