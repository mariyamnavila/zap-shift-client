import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner text-success loading-xl"></span></div>
    }

    if (!user) {
        <Navigate to={'/login'}></Navigate>
    }

    return children
};

export default PrivateRoute;