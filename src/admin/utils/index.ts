import axiosInstance from "@/api/axios.config";
import type { ICity, ICountry } from "@/interfaces";
import CookieService from "@/services/CookieService";

export const getCountries = async () => {
  try {
    let allData: ICountry[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await axiosInstance.get(
        `countries?pagination[page]=${page}&pagination[pageSize]=100`,
        {
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
          params: {
            filters: {
              isSupportedForShipping: {
                $eq: true,
              },
            },
            sort: ["name:asc"],
          },
        },
      );

      allData = [...allData, ...data.data];

      hasMore = page < data.meta.pagination.pageCount;
      page++;
    }
    return allData;
  } catch (error: any) {
    return error.response?.data?.message;
  }
};
export const getCitiesByCountries = async (countryId: number | undefined) => {
  try {
    let allData: ICity[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await axiosInstance.get(
        `cities?pagination[page]=${page}&pagination[pageSize]=100`,
        {
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
          params: {
            filters: {
              country: {
                id: {
                  $eq: countryId,
                },
              },
            },
            fields: ["name"],
          },
        },
      );

      allData = [...allData, ...data.data];

      hasMore = page < data.meta.pagination.pageCount;
      page++;
    }
    return allData;
  } catch (error: any) {
    return error.response?.data?.message || "Failed to fetch cities";
  }
};
