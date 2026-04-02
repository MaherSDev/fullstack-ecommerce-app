import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

interface IProps {
	
}

const AppLayout = ({  }: IProps) => {
	return (
		<> 
			<NavBar />
			<Outlet />
		</>
	)
}

export default AppLayout;