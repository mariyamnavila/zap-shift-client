import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth"; // your existing hook
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
    const { user, loading: authLoading } = useAuth(); // get logged-in user
    const axiosSecure = useAxiosSecure();

    const {
        data: role = "user", // default to 'user' if not loaded
        isLoading: roleLoading,
        refetch
    } = useQuery({
        queryKey: ["userRole", user?.email],
        enabled: !!user?.email && !authLoading,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/users/${user.email}/role`
            );
            return res.data.role;
        },
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
