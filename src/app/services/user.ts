import type { IUserData } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UsersApiSlice = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    getDashboardUsers: build.query({
      query: (arg) => {
        const { page = 1 } = arg;
        return {
          url: `users?pagination[page]=${page}&pagination[pageSize]=10`,
          method: "GET",
          params: {
            "populate[0]": "avatar",
            "populate[1]": "role",
          },
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      providesTags: ["Users"],
    }),
    getDashboardSingleUser: build.query({
      query: () => {
        return {
          url: `users/me?populate=role&populate=address&populate=avatar`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      providesTags: ["Users"],
    }),
    updateDashboardUser: build.mutation({
      query: ({ documentId, body }) => {
        return {
          url: `users/${documentId}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      async onQueryStarted(
        { documentId, ...patch },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          UsersApiSlice.util.updateQueryData(
            "getDashboardUsers",
            { page: 1 },
            (draft) => {
              const user = draft.data.find(
                (user: IUserData) => user.documentId === documentId,
              );

              if (user) {
                Object.assign(user, patch.data);
              } else {
                Object.assign(draft, patch);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Users"],
    }),
    createDashboardUser: build.mutation({
      query: ({ body }) => {
        return {
          url: `auth/local/register`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      invalidatesTags: ["Users"],
    }),
    deleteDashboardUser: build.mutation({
      query: (documentId) => {
        return {
          url: `users/${documentId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetDashboardUsersQuery,
  useGetDashboardSingleUserQuery,
  useDeleteDashboardUserMutation,
  useUpdateDashboardUserMutation,
  useCreateDashboardUserMutation,
} = UsersApiSlice;
