import useUserRole from "../../../hooks/useUserRole";
import Loading from "../../shared/Loading/Loading";
import Unauthorized from "../../Unauthorized/Unauthorized";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";


const DashboardHome = () => {
    const { role, roleLoading } = useUserRole();

    if (roleLoading) {
        return <Loading></Loading>
    }

    if (role === 'user') {
        return <UserDashboard />
    } else if (role === 'rider') {
        return <RiderDashboard />
    } else if (role === 'admin') {
        return <AdminDashboard />
    } else {
        return <Unauthorized />
    }
};

export default DashboardHome;