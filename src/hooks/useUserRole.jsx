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
    } = useQuery(
        ["userRole", user?.email],
        async () => {
            if (!user?.email) return "user";

            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data.role;
        },
        {
            enabled: !!user?.email && !authLoading, // only run when user is ready
            staleTime: 1000 * 60 * 5, // 5 minutes caching
            cacheTime: 1000 * 60 * 10 // 10 minutes
        }
    );

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
