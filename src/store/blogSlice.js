import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/api/blog`;

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Blogs", "UserBlogs", "Blog"],
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/createBlog",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Blogs", id: "LIST" },
        { type: "UserBlogs", id: "USER" },
      ],
    }),

    getAllBlogs: builder.query({
      query: ({ limit = 8, page = 1 }) => ({
        url: "/getAllBlogs",
        method: "GET",
        params: { limit, page },
      }),
      providesTags: [{ type: "Blogs", id: "LIST" }],
    }),

    getBlog: builder.query({
      query: (blogId) => ({
        url: `/getSingleBlog/${blogId}`,
        method: "GET",
      }),
      providesTags: (result, error, blogId) => [{ type: "Blog", id: blogId }],
    }),

    getUserBlog: builder.query({
      query: (userId) => ({
        url: `/getUserBlogs/${userId}`,
        method: "GET",
      }),
      providesTags: [{ type: "UserBlogs", id: "USER" }],
    }),

    editBlog: builder.mutation({
      query: ({ blogId, blogData }) => ({
        url: `/editBlog/${blogId}`,
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "Blog", id: blogId },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (userId) => ({
        url: `/deleteBlog/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Blogs", id: "LIST" },
        { type: "UserBlogs", id: "USER" },
      ],
    }),

    likeBlog: builder.mutation({
      query: ({ userId, postId }) => ({
        url: "/like",
        method: "PUT",
        body: { userId, blogId: postId },
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "Blog", id: blogId },
      ],
    }),

    getCategory: builder.query({
      query: () => ({
        url: "/getCategory",
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogQuery,
  useGetUserBlogQuery,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useGetCategoryQuery,
} = blogApi;

export default blogApi;
