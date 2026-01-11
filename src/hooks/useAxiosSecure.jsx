import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure =  axios.create({
    baseURL: `https://zap-shift-server-umber-ten.vercel.app`
})

const useAxiosSecure = () => {

    const { user,logOut } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Response interceptor to handle 401 and 403 errors
    axiosSecure.interceptors.response.use((res) => {
        return res;
    }, async (error) => {
        const status = error.status || error.response.status;
        if (error.response && status === 403) {
            // Handle unauthorized access, e.g., redirect to login
            // console.log("Unauthorized! Redirecting to login...");
            navigate('/unauthorized');
        } else if (error.response && status === 401) {
            // console.log("Authentication failed! Redirecting to login...");
            logOut()
            .then(() => {
                // Successfully logged out
                navigate('/login');
            })
            .catch((err) => {
                console.error("Error during logout:", err);
            });
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;