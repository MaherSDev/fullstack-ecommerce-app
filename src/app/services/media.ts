import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const MediaApiSlice = createApi({
  reducerPath: "mediaApi",
  tagTypes: ["Media"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    getDashboardMedia: build.query({
      query: (arg) => {
        const { page = 1 } = arg;
        return {
          url: `upload/files`,
          params: {
            "page": 1,
            "pageSize": 10,
          },
        };
      },
      providesTags: ["Media"],
    }),
    createDashboardMedia: build.mutation({
      query: ( body ) => {
        return {
          url: `upload`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      invalidatesTags: ["Media"],
    }),
    deleteDashboardMedia: build.mutation({
      query: (id) => {
        return {
          url: `upload/files/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      invalidatesTags: ["Media"],
    }),
  }),
});

export const {
  useGetDashboardMediaQuery,
  useDeleteDashboardMediaMutation,
  useCreateDashboardMediaMutation,
} = MediaApiSlice;
