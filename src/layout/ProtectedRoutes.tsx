import { Box } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import CookieService from "@/services/CookieService";

const ProtectedRoute = () => {
  const token = CookieService.get("jwt");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <>
      <Box as={"div"} h="calc(100dvh - 64px)">
        <Outlet />
      </Box>
    </>
  );
};

export default ProtectedRoute;
