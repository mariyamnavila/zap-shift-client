import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../Pages/shared/Loading/Loading';
import { Navigate } from 'react-router-dom';

const RiderRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (!user || role !== 'rider') {
        return <Navigate state={{ from: location.pathname }} to="/unauthorized" />;
    }

    return children
};

export default RiderRoute;