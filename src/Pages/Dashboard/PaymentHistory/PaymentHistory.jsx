import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import PaymentHistoryTable from "./PaymentHistoryTable";


const PaymentHistory = () => {

    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()

    const {data: payments = [],isPending} = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`)
            return res.data;
        }
    })

    if(isPending){
        return <Loading></Loading>
    }

    return <PaymentHistoryTable payments={payments} />;
};

export default PaymentHistory;