import type { ICategory } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CategoriesApiSlice = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Categories"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    getDashboardCategories: build.query({
      query: (arg) => {
        const { page = 1 } = arg;
        return {
          url: `categories?pagination[page]=${page}&pagination[pageSize]=10`,
          params: {
            "populate[0]": "products",
          },
        };
      },
      providesTags: ["Categories"],
    }),
    updateDashboardCategories: build.mutation({
      query: ({ documentId, body }) => {
        return {
          url: `categories/${documentId}`,
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
          CategoriesApiSlice.util.updateQueryData(
            "getDashboardCategories",
            { page: 1 },
            (draft) => {
              const category = draft.data.find(
								(p: ICategory) => p.documentId === documentId
							);

							if (category) {
								Object.assign(category, patch.data);
							}else {
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
      invalidatesTags: ["Categories"],
    }),
    deleteDashboardCategories: build.mutation({
      query: (documentId) => {
        return {
          url: `categories/${documentId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetDashboardCategoriesQuery,
  useDeleteDashboardCategoriesMutation,
  useUpdateDashboardCategoriesMutation,
} = CategoriesApiSlice;
