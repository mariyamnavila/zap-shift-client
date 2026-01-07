import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTruckLoading } from "react-icons/fa";
import Swal from "sweetalert2";


const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch pending parcels for rider
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["riderPendingParcels", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/riders/${user.email}/pending-parcels`
            );
            return res.data;
        }
    });

    // Update delivery status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ parcelId, status }) => {
            const res = await axiosSecure.patch(
                `/parcels/${parcelId}/status`,
                { deliveryStatus: status }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["riderPendingParcels", user?.email]);
        }
    });



    const handleParcelAction = async (parcel) => {
        const isPickup = parcel.deliveryStatus === "rider-assigned";
        const nextStatus = isPickup ? "in-transit" : "delivered";

        const result = await Swal.fire({
            title: isPickup ? "Confirm Pickup?" : "Confirm Delivery?",
            text: isPickup
                ? `Have you picked up parcel ${parcel.trackingNumber}?`
                : `Have you delivered parcel ${parcel.trackingNumber}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isPickup ? "Yes, Picked Up" : "Yes, Delivered",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#ef4444"
        });

        if (!result.isConfirmed) return;

        try {
            await updateStatusMutation.mutateAsync({
                parcelId: parcel._id,
                status: nextStatus
            });

            await Swal.fire({
                icon: "success",
                title: "Updated",
                text: isPickup
                    ? "Parcel is now in transit"
                    : "Parcel delivered successfully",
                timer: 1800,
                showConfirmButton: false
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    error.response?.data?.message ||
                    "Failed to update parcel status"
            });
        }
    };


    if (isLoading) {
        return <Loading />;
    }


    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-5 text-primary">
                Pending Deliveries
            </h2>

            <div className="overflow-x-auto bg-base-200 rounded-xl">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tracking No</th>
                            <th>Parcel</th>
                            <th>Pickup</th>
                            <th>Delivery</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>

                                <td className="font-mono text-sm">
                                    {parcel.trackingNumber}
                                </td>

                                <td>
                                    <p className="font-semibold capitalize">
                                        {parcel.type}
                                    </p>
                                    <p className="text-xs opacity-70">
                                        {parcel.parcelName}
                                    </p>
                                </td>

                                <td>
                                    <p className="font-medium text-sm">
                                        {parcel.senderName}
                                    </p>
                                    <p className="text-xs opacity-70">
                                        {parcel.senderDistrict}
                                    </p>
                                </td>

                                <td>
                                    <p className="font-medium text-sm">
                                        {parcel.receiverName}
                                    </p>
                                    <p className="text-xs opacity-70">
                                        {parcel.receiverDistrict}
                                    </p>
                                </td>

                                <td>
                                    <span className={`badge ${parcel.deliveryStatus === "rider-assigned"
                                        ? "badge-warning"
                                        : "badge-info"
                                        }`}>
                                        {parcel.deliveryStatus}
                                    </span>
                                </td>

                                <td className="text-center">
                                    {parcel.deliveryStatus === "rider-assigned" && (
                                        <button
                                            className="btn btn-sm btn-warning gap-2"
                                            onClick={() => handleParcelAction(parcel)}
                                        >
                                            <FaTruckLoading />
                                            Picked Up
                                        </button>
                                    )}

                                    {parcel.deliveryStatus === "in-transit" && (
                                        <button
                                            className="btn btn-sm btn-success gap-2"
                                            onClick={() => handleParcelAction(parcel)}
                                        >
                                            <FaCheckCircle />
                                            Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-10 opacity-70">
                                    No pending deliveries 🎉
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingDeliveries;