import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineCheckCircle } from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../shared/Loading/Loading";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["completedDeliveries", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/riders/${user.email}/completed-parcels`
            );
            return res.data;
        }
    });

    const cashOutMutation = useMutation({
        mutationFn: async (parcelId) => {
            const res = await axiosSecure.patch(
                `/parcels/${parcelId}/cashOut`
            );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Cash-out successful",
                text: "Your earnings have been added 💰",
                timer: 1800,
                showConfirmButton: false
            });

            queryClient.invalidateQueries([
                "completedDeliveries",
                user?.email
            ]);
        },
        onError: (err) => {
            Swal.fire({
                icon: "error",
                title: "Cash-out failed",
                text:
                    err?.response?.data?.message ||
                    "Something went wrong"
            });
        }
    });


    const handleCashOut = (parcel) => {
        Swal.fire({
            title: "Confirm Cash-out",
            text: `You will receive ৳${calculateEarning(parcel).toFixed(2)} for this delivery.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cash Out",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a"
        }).then((result) => {
            if (result.isConfirmed) {
                cashOutMutation.mutate(parcel._id);
            }
        });
    };


    if (isLoading) return <Loading />;

    const calculateEarning = (parcel) => {
        const sameDistrict =
            parcel.senderDistrict === parcel.receiverDistrict;
        return sameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.3;
    };

    const totalEarning = parcels.reduce(
        (sum, p) => sum + calculateEarning(p),
        0
    );

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <MdOutlineCheckCircle className="text-3xl" />
                Completed Deliveries
            </h2>

            {/* Earnings Summary */}
            <div className="stats shadow bg-base-200 mb-6">
                <div className="stat">
                    <div className="stat-title">Total Completed</div>
                    <div className="stat-value">{parcels.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Earnings</div>
                    <div className="stat-value text-success">
                        ৳{totalEarning.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-200 rounded-xl">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tracking</th>
                            <th>Route</th>
                            <th>Picked Up</th>
                            <th>Delivered</th>
                            <th>Fee</th>
                            <th>Earning</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels.map((parcel, index) => {
                            const earning = calculateEarning(parcel);
                            const isPaid = parcel.cashOutStatus === "paid";

                            return (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>

                                    <td className="font-mono text-sm">
                                        {parcel.trackingNumber}
                                    </td>

                                    <td>
                                        <p className="font-medium">
                                            {parcel.senderDistrict} → {parcel.receiverDistrict}
                                        </p>
                                        <p className="text-xs opacity-70">
                                            {parcel.deliveryZone}
                                        </p>
                                    </td>

                                    <td className="text-sm">
                                        {new Date(parcel.pickedUpAt).toLocaleString()}
                                    </td>

                                    <td className="text-sm">
                                        {new Date(parcel.deliveredAt).toLocaleString()}
                                    </td>

                                    <td className="font-semibold">
                                        ৳{parcel.cost}
                                    </td>

                                    <td className="font-bold text-success">
                                        ৳{earning.toFixed(2)}
                                    </td>

                                    <td>
                                        {isPaid ? (
                                            <span className="badge badge-success">
                                                Paid
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleCashOut(parcel)}
                                                disabled={cashOutMutation.isLoading}
                                                className="btn btn-xs btn-primary"
                                            >
                                                Cash Out
                                            </button>

                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-10 opacity-70">
                                    No completed deliveries yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries;
