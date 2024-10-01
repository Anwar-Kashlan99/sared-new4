import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API if not already defined globally
const baseUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/api/live`;

// Setup the RTK Query API for rooms
export const liveApi = createApi({
  reducerPath: "liveApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["liveRoom"],
  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: (roomDetails) => ({
        url: "/createRoomLive",
        method: "POST",
        body: roomDetails,
      }),
      invalidatesTags: [{ type: "liveRoom", id: "LIST" }],
    }),
    getAllRooms: builder.query({
      query: () => ({
        url: "/allRoomLive",
        method: "POST",
      }),
      providesTags: [{ type: "Room", id: "LIST" }],
    }),
    getRoom: builder.query({
      query: (roomId) => ({
        url: `/showRoomLive/${roomId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),

    deleteLive: builder.mutation({
      query: (roomId) => ({
        url: "/deleteRoomLive",
        method: "DELETE",
        body: roomId,
      }),
      invalidatesTags: [{ type: "liveRoom", id: "LIST" }],
    }),
  }),
});
// Export hooks for use in components
export const {
  useCreateRoomMutation,
  useGetAllRoomsQuery,
  useGetRoomQuery,
  useDeleteLiveMutation,
} = liveApi;

export default liveApi;
