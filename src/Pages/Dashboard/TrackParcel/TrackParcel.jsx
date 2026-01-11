import { useState, useEffect } from "react";
import { Package, Search, MapPin, Clock, CheckCircle, AlertCircle, Truck, Bike } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";

const TrackParcel = () => {
    // In your actual app, restore: const { trackingId: trackingParam } = useParams();
    const { trackingId: trackingParam } = useParams();
    // In your actual app, restore: const navigate = useNavigate();
    const navigate = useNavigate();
    // const trackingParam = ""; // Demo only - use useParams in your app

    const axiosSecure = useAxiosSecure();

    const [trackingNumber, setTrackingNumber] = useState(trackingParam || "");
    const [trackingUpdates, setTrackingUpdates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTrackingUpdates = async (trackId) => {
        if (!trackId) return;
        try {
            setLoading(true);
            setError("");
            const res = await axiosSecure.get(`/tracking/${trackId}`);
            setTrackingUpdates(res.data);
            // console.log(res.data);
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
        // In your actual app, restore: navigate(`/dashboard/track/${trackingNumber}`);
        navigate(`/dashboard/track/${trackingNumber}`);
        fetchTrackingUpdates(trackingNumber);
    };

    const getStatusIcon = (status) => {
        const statusLower = status.toLowerCase();

        if (statusLower.includes("delivered"))
            return <CheckCircle className="w-5 h-5 text-[#caeb66]" />;

        if (statusLower.includes("rider-assigned") || statusLower.includes("assigned"))
            return <Bike className="w-5 h-5 text-[#caeb66]" />;

        if (statusLower.includes("transit") || statusLower.includes("delivery"))
            return <Truck className="w-5 h-5 text-gray-700" />;

        if (statusLower.includes("picked"))
            return <Package className="w-5 h-5 text-gray-700" />;

        return <MapPin className="w-5 h-5 text-gray-500" />;
    };

    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes("delivered")) return "bg-[#caeb66]/40 text-black border-[#caeb66]";
        if (statusLower.includes("delivery")) return "bg-gray-100 text-gray-800 border-gray-300";
        if (statusLower.includes("transit")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
        return "bg-gray-100 text-gray-800 border-gray-300";
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#caeb66]/20 via-white to-[#caeb66]/10 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                        <Package className="w-10 h-10 text-[#caeb66]" />
                        <h1 className="text-4xl font-bold bg-linear-to-r from-[#caeb66] to-lime-300 bg-clip-text text-transparent">
                            Track Your Parcel
                        </h1>
                    </div>
                    <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter Tracking ID (try TRACK123)"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/40 focus:outline-none transition-colors text-lg text-black"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            className="bg-[#caeb66] text-black font-semibold px-8 py-4 rounded-xl hover:brightness-95 hover:shadow-lg transition-all duration-200"
                            onClick={handleSearch}
                        >
                            Track Parcel
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Fetching tracking updates...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-red-900 mb-1">Tracking Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Tracking Results */}
                {trackingUpdates.length > 0 && !loading && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header Section */}
                        <div className="bg-[#caeb66] p-6 text-black">
                            <div className="flex items-center gap-3 mb-2">
                                <Package className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">Tracking Details</h2>
                            </div>
                            <p className="text-black/70">ID: {trackingNumber}</p>
                        </div>

                        {/* Current Status Banner */}
                        <div className={`p-6 border-b-2 ${getStatusColor(trackingUpdates[0].status)}`}>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(trackingUpdates[0].status)}
                                <div>
                                    <p className="text-sm font-medium opacity-80">Current Status</p>
                                    <p className="text-xl font-bold">{trackingUpdates[0].status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-6">
                            <div className="relative">
                                {trackingUpdates
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map((update, index) => (
                                        <div key={index} className="relative pb-8 last:pb-0">
                                            {/* Connector Line */}
                                            {index !== trackingUpdates.length - 1 && (
                                                <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-linear-to-b from-[#caeb66] to-gray-200"></div>
                                            )}

                                            {/* Timeline Item */}
                                            <div className="flex gap-4">
                                                {/* Icon */}
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-sm z-10">
                                                    {getStatusIcon(update.status)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            {update.status}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock className="w-4 h-4" />
                                                            {new Date(update.timestamp).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                        <MapPin className="w-4 h-4 shrink-0" />
                                                        <span className="font-medium">{update.location ? update.location : 'N/A'}</span>
                                                    </div>

                                                    {update.message && (
                                                        <p className="text-gray-600 text-sm pl-6">
                                                            {update.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {trackingUpdates.length === 0 && !loading && !error && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-gray-300">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tracking Data Yet</h3>
                        <p className="text-gray-500">Enter a tracking ID above to see your parcel's journey</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackParcel;