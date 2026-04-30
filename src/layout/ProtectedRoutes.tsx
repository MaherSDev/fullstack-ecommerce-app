import { Box } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import CookieService from "@/services/CookieService";

const ProtectedRoute = () => {
  const token = CookieService.get("jwt");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  );
};

export default ProtectedRoute;
