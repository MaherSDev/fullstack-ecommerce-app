import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import CookieService from "@/services/CookieService";

const LoginLayout = () => {
  const location = useLocation();
  const token = CookieService.get("jwt");

  if (token) {
    const from = location.state?.from || "/";
		console.log(from)
    return <Navigate to={from} replace />;
  }

  return (
    <Box h="100dvh">
      <Outlet />
    </Box>
  );
};

export default LoginLayout;
