import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../shared/Loading/Loading";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi2";

const MyEarnings = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["myEarnings", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/riders/${user.email}/completed-parcels`
            );
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    // 💰 earning logic
    const calculateEarning = (parcel) => {
        const sameDistrict =
            parcel.senderDistrict === parcel.receiverDistrict;
        return sameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.3;
    };

    // 🕒 current local time (Bangladesh)
    const now = new Date();

    // 🔐 normalize delivered date to LOCAL date (very important)
    const getLocalDate = (dateStr) => {
        const d = new Date(dateStr);
        return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
        );
    };

    const todayLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfWeek = new Date(todayLocal);
    startOfWeek.setDate(todayLocal.getDate() - todayLocal.getDay());

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const startOfYear = new Date(
        now.getFullYear(),
        0,
        1
    );

    const sumEarnings = (filterFn) =>
        parcels
            .filter(filterFn)
            .reduce((sum, p) => sum + calculateEarning(p), 0);

    // 📊 totals
    const totalEarning = sumEarnings(() => true);

    const totalCashedOut = parcels
        .filter((p) => p.cashOutStatus === "paid")
        .reduce(
            (sum, p) =>
                sum + (p.riderEarning || calculateEarning(p)),
            0
        );

    const totalPending = totalEarning - totalCashedOut;

    // ⏱️ analytics (ALL FIXED)
    const todayEarning = sumEarnings(
        (p) => getLocalDate(p.deliveredAt).getTime() === todayLocal.getTime()
    );

    const weekEarning = sumEarnings(
        (p) => getLocalDate(p.deliveredAt) >= startOfWeek
    );

    const monthEarning = sumEarnings(
        (p) => getLocalDate(p.deliveredAt) >= startOfMonth
    );

    const yearEarning = sumEarnings(
        (p) => getLocalDate(p.deliveredAt) >= startOfYear
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
                <HiOutlineCurrencyBangladeshi className="text-3xl" />
                My Earnings
            </h2>

            {/* Summary */}
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200">
                <div className="stat">
                    <div className="stat-title">Total Earnings</div>
                    <div className="stat-value text-success">
                        ৳{totalEarning.toFixed(2)}
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Cashed Out</div>
                    <div className="stat-value">
                        ৳{totalCashedOut.toFixed(2)}
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-warning">
                        ৳{totalPending.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <EarningCard title="Today" amount={todayEarning} />
                <EarningCard title="This Week" amount={weekEarning} />
                <EarningCard title="This Month" amount={monthEarning} />
                <EarningCard title="This Year" amount={yearEarning} />
                <EarningCard title="Overall" amount={totalEarning} highlight />
            </div>
        </div>
    );
};

const EarningCard = ({ title, amount, highlight }) => (
    <div className="card bg-base-200 shadow">
        <div className="card-body">
            <p className="text-sm opacity-70">{title}</p>
            <h3
                className={`text-xl font-bold ${highlight ? "text-success" : ""
                    }`}
            >
                ৳{amount.toFixed(2)}
            </h3>
        </div>
    </div>
);

export default MyEarnings;
