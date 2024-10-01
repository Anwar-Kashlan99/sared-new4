import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api/user`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "/changePassword",
        method: "POST",
        body: { oldPassword, newPassword },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to change password.", error.message);
        }
      },
    }),

    getUserProfile: builder.query({
      query: (userId) => ({
        url: `/getProfile/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "UserProfile", id: userId },
      ], // Provide tag for invalidation
    }),

    updateCaver: builder.mutation({
      query: (caver) => {
        const formData = new FormData();
        formData.append("caver", caver);

        return {
          url: "/updateCaver",
          method: "POST",
          body: formData,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to change caver.", error.message);
        }
      },
    }),

    followUser: builder.mutation({
      query: (userId) => ({
        url: `/Follower/${userId}`, // Use userId in the URL
        method: "POST", // POST request to follow the user
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Follow user response:", data); // Response logging
          dispatch(
            userApi.util.invalidateTags([{ type: "UserProfile", id: arg }])
          );
        } catch (error) {
          console.error("Failed to follow user.", error.message);
        }
      },
    }),
    searchUsers: builder.query({
      query: (searchTerm) => `/search/${searchTerm}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateCaverMutation,
  useFollowUserMutation,
  useSearchUsersQuery,
} = userApi;

export default userApi;
