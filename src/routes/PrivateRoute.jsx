import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "../Pages/shared/Loading/Loading";


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loading></Loading>
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to={'/login'}></Navigate>
    }

    return children
};

export default PrivateRoute;