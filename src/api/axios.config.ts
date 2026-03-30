import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://strapiecomm.mahersdev.com/api",
})

export default axiosInstance;