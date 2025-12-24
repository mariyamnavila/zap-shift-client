import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const useUpdateTracking = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const addTrackingUpdate = async ({ parcelId, trackingNumber, status, location, message, updatedBy }) => {
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await axiosSecure.post("/tracking", {
                parcelId,
                trackingNumber,
                status,
                location,
                message,
                updatedBy
            });

            setSuccess(true);
            return res.data;
        } catch (err) {
            console.error("Tracking update error:", err);
            setError(err.response?.data?.message || "Failed to update tracking");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { addTrackingUpdate, loading, error, success };
};

export default useUpdateTracking;
