import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TrackParcel = () => {
    const { trackingNumber: trackingParam } = useParams(); // URL param
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [trackingNumber, setTrackingNumber] = useState(trackingParam || "");
    const [trackingUpdates, setTrackingUpdates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch tracking updates
    const fetchTrackingUpdates = async (trackId) => {
        if (!trackId) return;
        try {
            setLoading(true);
            setError("");
            const res = await axiosSecure.get(`/tracking/${trackId}`);
            setTrackingUpdates(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Tracking not found");
            setTrackingUpdates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (trackingParam) fetchTrackingUpdates(trackingParam);
    }, [trackingParam]);

    const handleSearch = () => {
        if (trackingNumber.trim() === "") return;
        navigate(`/track/${trackingNumber}`);
        fetchTrackingUpdates(trackingNumber);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Track Your Parcel</h2>

            {/* Search Box */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter Tracking ID"
                    className="input input-bordered flex-1"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    Track
                </button>
            </div>

            {/* Loading/Error */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-error">{error}</p>}

            {/* Timeline */}
            {trackingUpdates.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-4">
                        Tracking Updates for {trackingNumber}
                    </h3>

                    <ul className="steps steps-vertical border-l border-gray-300">
                        {trackingUpdates
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // latest first
                            .map((update, index) => (
                                <li key={index} className="step step-primary mb-2">
                                    <div>
                                        <span className="font-semibold">{update.status}</span> -{" "}
                                        <span className="text-gray-500">{update.location}</span>
                                    </div>
                                    {update.message && (
                                        <div className="text-xs text-gray-400">{update.message}</div>
                                    )}
                                    <div className="text-xs text-gray-400">
                                        {new Date(update.timestamp).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {trackingUpdates.length === 0 && !loading && !error && (
                <p className="text-gray-500 mt-4 text-center">Enter a tracking ID to see updates.</p>
            )}
        </div>
    );
};

export default TrackParcel;
