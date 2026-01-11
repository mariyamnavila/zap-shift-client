import { useQuery } from "@tanstack/react-query";
import {
    MdAssignmentLate,
    MdOutlineAssignmentInd,
    MdLocalShipping,
    MdOutlineCheckCircle,
    MdStore
} from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

/**
 * Status → UI mapping
 * Add new statuses here if backend grows
 */
const statusConfig = {
    "not-collected": {
        label: "Not Collected",
        icon: MdAssignmentLate,
        color: "text-warning"
    },
    "rider-assigned": {
        label: "Rider Assigned",
        icon: MdOutlineAssignmentInd,
        color: "text-info"
    },
    "in-transit": {
        label: "In Transit",
        icon: MdLocalShipping,
        color: "text-primary"
    },
    delivered: {
        label: "Delivered",
        icon: MdOutlineCheckCircle,
        color: "text-success"
    },
    "service-center-delivered": {
        label: "Service Center",
        icon: MdStore,
        color: "text-secondary"
    }
};

/**
 * Status label + color mapping
 * Colors chosen to match DaisyUI tone
 */
const STATUS_META = {
    "not-collected": {
        label: "Not Collected",
        color: "#fbbd23" // warning
    },
    "rider-assigned": {
        label: "Rider Assigned",
        color: "#3abff8" // info
    },
    "in-transit": {
        label: "In Transit",
        color: "#605dff" // primary
    },
    delivered: {
        label: "Delivered",
        color: "#36d399" // success
    },
    "service-center-delivered": {
        label: "Service Center",
        color: "#a855f7" // secondary
    }
};

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["parcel-status-count"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/parcels/delivery/status-count"
            );
            return res.data;
        }
    });

    /* ---------------- Loading ---------------- */
    if (isLoading) {
        return (
            <Loading
                main="📦 Counting parcels…"
                sub="Making sure every box is accounted for."
            />
        );
    }

    /* ---------------- Error ---------------- */
    if (isError) {
        return (
            <div className="bg-base-200 p-6 rounded-xl text-center">
                <p className="text-error font-semibold">
                    Failed to load parcel status overview
                </p>
            </div>
        );
    }

    /* ---------- Transform data ---------- */
    const chartData = data.map((item) => ({
        name: STATUS_META[item.status]?.label || item.status,
        value: item.count,
        color: STATUS_META[item.status]?.color || "#ccc"
    }));

    /* ---------------- UI ---------------- */
    return (
        <div>
            <div className="bg-base-200 p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-4">
                    📊 Parcel Status Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {data.map((item) => {
                        const config = statusConfig[item.status];
                        if (!config) return null;

                        const Icon = config.icon;

                        return (
                            <div
                                key={item.status}
                                className="card bg-base-100 shadow hover:shadow-md transition"
                            >
                                <div className="card-body items-center text-center gap-2">
                                    <Icon className={`text-4xl ${config.color}`} />

                                    <p className="text-sm opacity-70">
                                        {config.label}
                                    </p>

                                    <h2 className="text-2xl font-bold">
                                        {item.count}
                                    </h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        {/* pie chart version - future enhancement */}
            <div className="bg-base-200 p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-4">
                    🥧 Delivery Status Distribution
                </h3>

                <div className="w-full h-[320px]">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                innerRadius={60}
                                paddingAngle={3}
                                label={({ name, value }) => `${name}: ${value}`}
                                labelLine={false}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
