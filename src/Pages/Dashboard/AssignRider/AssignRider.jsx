import { useQuery } from "@tanstack/react-query";
import { FaUserPlus } from "react-icons/fa";
import Loading from '../../shared/Loading/Loading';
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["assignableParcels"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/parcels?paymentStatus=paid&deliveryStatus=not-collected"
            );
            return res.data;
        }
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">
                Assign Rider
            </h2>

            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto bg-base-200 rounded-xl">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tracking No</th>
                            <th>Parcel</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Zone</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels?.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>

                                <td className="font-mono text-sm">
                                    {parcel.trackingNumber}
                                </td>

                                <td>
                                    <div>
                                        <p className="font-semibold capitalize">
                                            {parcel.type}
                                        </p>
                                        <p className="text-xs opacity-70">
                                            {parcel.parcelName}
                                        </p>
                                    </div>
                                </td>

                                <td>
                                    <p className="font-medium">{parcel.senderName}</p>
                                    <p className="text-xs opacity-70">
                                        {parcel.senderDistrict}
                                    </p>
                                </td>

                                <td>
                                    <p className="font-medium">{parcel.receiverName}</p>
                                    <p className="text-xs opacity-70">
                                        {parcel.receiverDistrict}
                                    </p>
                                </td>

                                <td>
                                    <span className="badge badge-outline">
                                        {parcel.deliveryZone}
                                    </span>
                                </td>

                                <td className="font-semibold">
                                    ৳{parcel.cost}
                                </td>

                                <td>
                                    <span className="badge badge-warning">
                                        {parcel.deliveryStatus}
                                    </span>
                                </td>

                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-primary gap-2"
                                        onClick={() => {
                                            // will implement later
                                            console.log("Assign rider to:", parcel.trackingNumber);
                                        }}
                                    >
                                        <FaUserPlus />
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center py-10 opacity-70">
                                    No parcels available for rider assignment
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View - Hidden on desktop */}
            <div className="lg:hidden space-y-4">
                {parcels?.map((parcel, index) => (
                    <div key={parcel._id} className="card bg-base-100 shadow-lg">
                        <div className="card-body p-4">
                            {/* Header with Number and Status */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="badge badge-neutral">#{index + 1}</div>
                                <span className="badge badge-warning">
                                    {parcel.deliveryStatus}
                                </span>
                            </div>

                            {/* Tracking Number */}
                            <div className="mb-3">
                                <p className="text-xs text-base-content/60 mb-1">Tracking Number</p>
                                <p className="font-mono text-sm font-semibold">
                                    {parcel.trackingNumber}
                                </p>
                            </div>

                            {/* Parcel Info */}
                            <div className="mb-3">
                                <p className="text-xs text-base-content/60 mb-1">Parcel</p>
                                <p className="font-semibold capitalize">{parcel.type}</p>
                                <p className="text-sm opacity-70">{parcel.parcelName}</p>
                            </div>

                            {/* Sender & Receiver Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <p className="text-xs text-base-content/60 mb-1">Sender</p>
                                    <p className="font-medium text-sm">{parcel.senderName}</p>
                                    <p className="text-xs opacity-70">{parcel.senderDistrict}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/60 mb-1">Receiver</p>
                                    <p className="font-medium text-sm">{parcel.receiverName}</p>
                                    <p className="text-xs opacity-70">{parcel.receiverDistrict}</p>
                                </div>
                            </div>

                            {/* Zone & Cost */}
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <p className="text-xs text-base-content/60 mb-1">Zone</p>
                                    <span className="badge badge-outline">{parcel.deliveryZone}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-base-content/60 mb-1">Cost</p>
                                    <p className="font-semibold text-lg">৳{parcel.cost}</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                className="btn btn-primary btn-block gap-2"
                                onClick={() => {
                                    // will implement later
                                    console.log("Assign rider to:", parcel.trackingNumber);
                                }}
                            >
                                <FaUserPlus />
                                Assign Rider
                            </button>
                        </div>
                    </div>
                ))}

                {parcels.length === 0 && (
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body text-center py-10 opacity-70">
                            No parcels available for rider assignment
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignRider;