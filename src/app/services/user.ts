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
      query: () => {
        return {
          url: `users?populate=role&populate=avatar`,
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
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      providesTags: ["Users"],
    }),
    updateDashboardUser: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `users/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      async onQueryStarted(
        { id, ...patch },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          UsersApiSlice.util.updateQueryData(
            "getDashboardUsers",
            { page: 1 },
            (draft) => {
              const user = draft.data.find(
                (user: IUserData) => user.id === id,
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
          url: `users`,
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
      query: (id) => {
        return {
          url: `users/${id}`,
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
