import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";

const ActiveRider = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState("");

    const { data: riders = [], isLoading, refetch } = useQuery({
        queryKey: ["activeRiders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/active");
            return res.data;
        }
    });

    const filteredRiders = useMemo(() => {
        return riders.filter(rider =>
            rider.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [riders, search]);

    if (isLoading) return <Loading />;

    // 🔕 Deactivate Rider
    const handleDeactivate = (id) => {
        Swal.fire({
            title: "Deactivate this rider?",
            text: "The rider will no longer receive assignments.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deactivate"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.patch(`/riders/${id}/status`, {
                    status: "inactive"
                });

                Swal.fire("Deactivated", "Rider has been deactivated.", "success");
                refetch();
            }
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Active Riders ({filteredRiders.length})
                </h2>

                <input
                    type="text"
                    placeholder="Search by name..."
                    className="input input-bordered max-w-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRiders.map(rider => (
                            <tr key={rider._id}>
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.phone}</td>
                                <td>{rider.region}</td>
                                <td>{rider.district}</td>
                                <td>
                                    <span className="badge badge-success">
                                        Active
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDeactivate(rider._id)}
                                    >
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredRiders.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">
                        No riders found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActiveRider;
