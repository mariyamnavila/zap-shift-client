import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyParcels = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const { data: parcels = [],refetch } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`)
            return res.data
        }
    })

    console.log(parcels);

    // 👉 View parcel details
    const handleView = (parcel) => {
        console.log("View parcel:", parcel);
        // later: open modal or navigate to details page
    };

    // 👉 Pay for parcel
    const handlePay = (parcel) => {
        console.log("Pay for parcel:", parcel);
        // later: redirect to payment gateway
    };

    // 👉 Delete parcel
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This parcel will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
        }).then((result) => {
            if (result.isConfirmed) {

                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                icon: "success",
                                title: "Deleted!",
                                text: "Parcel has been deleted successfully.",
                            });
                            refetch();
                        } else {
                            // edge case: no delete happened
                            Swal.fire({
                                icon: "error",
                                title: "Failed!",
                                text: "Parcel could not be deleted.",
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);

                        Swal.fire({
                            icon: "error",
                            title: "Oops!",
                            text: error?.response?.data?.message ||
                                "Something went wrong. Please try again.",
                        });
                    });
            }
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Cost</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {parcels.map((parcel, index) => (
                        <tr key={parcel._id}>
                            <td>{index + 1}</td>

                            {/* Parcel Name */}
                            <td className="font-medium">
                                {parcel.parcelName}
                            </td>

                            {/* Type */}
                            <td className="capitalize">
                                {parcel.type}
                            </td>

                            {/* Creation Date */}
                            <td>
                                {new Date(parcel.creationDate).toLocaleDateString()}
                            </td>

                            {/* Cost */}
                            <td>
                                {parcel.cost} BDT
                            </td>

                            {/* Payment Status */}
                            <td>
                                <span
                                    className={`badge ${parcel.paymentStatus === 'paid'
                                        ? 'badge-success'
                                        : 'badge-error'
                                        }`}
                                >
                                    {parcel.paymentStatus}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="space-x-2">
                                <button
                                    className="btn btn-xs btn-info"
                                    onClick={() => handleView(parcel)}
                                >
                                    View
                                </button>

                                {parcel.paymentStatus === 'unpaid' && (
                                    <button
                                        className="btn btn-xs btn-warning"
                                        onClick={() => handlePay(parcel)}
                                    >
                                        Pay
                                    </button>
                                )}

                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={() => handleDelete(parcel._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {parcels.length === 0 && (
                <p className="text-center mt-6 text-gray-500">
                    No parcels found
                </p>
            )}
        </div>
    );
};

export default MyParcels;