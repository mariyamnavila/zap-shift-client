import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";

const PendingRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedRider, setSelectedRider] = useState(null);

    const { data: riders = [], isLoading, refetch } = useQuery({
        queryKey: ["pendingRiders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    // ✅ Approve Rider
    const handleApprove = async (id) => {
        Swal.fire({
            title: "Approve this rider?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, approve"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.patch(`/riders/approve/${id}`);
                Swal.fire("Approved!", "Rider has been approved.", "success");
                setSelectedRider(null);
                refetch();
            }
        });
    };

    // ❌ Reject Rider
    const handleReject = async (id) => {
        Swal.fire({
            title: "Reject this application?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reject"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.patch(`/riders/reject/${id}`);
                Swal.fire("Rejected", "Application rejected.", "success");
                setSelectedRider(null);
                refetch();
            }
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
                Pending Riders ({riders.length})
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Applied At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map(rider => (
                            <tr key={rider._id}>
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.region}</td>
                                <td>{rider.district}</td>
                                <td>
                                    {new Date(rider.appliedAt).toLocaleDateString()}
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-xs btn-info"
                                        onClick={() => setSelectedRider(rider)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => handleApprove(rider._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleReject(rider._id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedRider && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">
                            Rider Details
                        </h3>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <p><b>Name:</b> {selectedRider.name}</p>
                            <p><b>Email:</b> {selectedRider.email}</p>
                            <p><b>Phone:</b> {selectedRider.phone}</p>
                            <p><b>Age:</b> {selectedRider.age}</p>
                            <p><b>Region:</b> {selectedRider.region}</p>
                            <p><b>District:</b> {selectedRider.district}</p>
                            <p><b>Experience:</b> {selectedRider.experience}</p>
                            <p><b>NID:</b> {selectedRider.nid}</p>
                            <p><b>Bike Brand:</b> {selectedRider.bikeBrand}</p>
                            <p><b>Bike Reg:</b> {selectedRider.bikeRegistration}</p>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-success"
                                onClick={() => handleApprove(selectedRider._id)}
                            >
                                Approve
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={() => handleReject(selectedRider._id)}
                            >
                                Reject
                            </button>
                            <button
                                className="btn"
                                onClick={() => setSelectedRider(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PendingRiders;
