import { AbsoluteCenter, Box, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import CookieService from "@/services/CookieService";
import { useGetDashboardSingleUserQuery } from "@/app/services/user";

const ProtectedRoute = () => {
  const token = CookieService.get("jwt");
  const { isLoading, data, isError, error } =
    useGetDashboardSingleUserQuery("");
  const location = useLocation();

  if (isLoading)
    return (
      <AbsoluteCenter>
        <Spinner size="xl" />
      </AbsoluteCenter>
    );
  if (isError && error.status !== 401) return <AbsoluteCenter>Network</AbsoluteCenter>;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (token && data?.role?.type === "customer") {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return (
    <Box>
      <Outlet context={data} />
    </Box>
  );
};

export default ProtectedRoute;
