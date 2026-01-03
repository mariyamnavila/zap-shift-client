import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure"

const BeARider = () => {
    const { user } = useAuth();
    const coverageData = useLoaderData();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: user?.displayName || "",
            email: user?.email || "",
            status: "pending"
        }
    });

    const [selectedRegion, setSelectedRegion] = useState("");

    /* ---------------- Derived Data ---------------- */

    const regions = [...new Set(coverageData.map(item => item.region))];

    const districts = [
        ...new Set(
            coverageData
                .filter(item => item.region === selectedRegion)
                .map(item => item.district)
        )
    ];

    /* ---------------- Submit ---------------- */

    const onSubmit = (data) => {
        const riderApplication = {
            ...data,
            appliedAt: new Date().toISOString(),
            status: "pending"
        };

        console.log("Rider Application:", riderApplication);

        axiosSecure.post('/riders', riderApplication)
            .then(res => {
                console.log(res.data);
                if (res.data.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Application Submitted",
                        text: "Your rider application is pending approval.",
                        confirmButtonText: "OK",
                    });
                }
            });

    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-3xl">
            <h2 className="text-2xl font-bold text-accent mb-2">
                Become a Rider 🚴‍♂️
            </h2>
            <p className="text-sm opacity-70 mb-6">
                Apply to deliver parcels in your area
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">

                {/* Name */}
                <div>
                    <label className="label">Full Name</label>
                    <input
                        readOnly
                        className="input input-bordered bg-base-300 w-full"
                        {...register("name")}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="label">Email</label>
                    <input
                        readOnly
                        className="input input-bordered bg-base-300 w-full"
                        {...register("email")}
                    />
                </div>

                {/* Age & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Age</label>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            {...register("age", {
                                required: "Age is required",
                                min: { value: 18, message: "Must be 18+" }
                            })}
                        />
                        {errors.age && (
                            <p className="text-red-500 text-sm">{errors.age.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            className="input input-bordered w-full"
                            {...register("phone", { required: "Phone is required" })}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>
                </div>

                {/* Region & District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="label">Region</label>
                        <select
                            className="select select-bordered w-full"
                            {...register("region", { required: true })}
                            onChange={(e) => {
                                setSelectedRegion(e.target.value);
                                setValue("district", "");
                            }}
                        >
                            <option value="">Select Region</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label">District</label>
                        <select
                            className="select select-bordered w-full"
                            {...register("district", { required: true })}
                            disabled={!selectedRegion}
                        >
                            <option value="">Select District</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* NID */}
                <div>
                    <label className="label">National ID Number</label>
                    <input
                        className="input input-bordered w-full"
                        {...register("nid", { required: "NID is required" })}
                    />
                    {errors.nid && (
                        <p className="text-red-500 text-sm">{errors.nid.message}</p>
                    )}
                </div>

                {/* Bike Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Bike Brand</label>
                        <input
                            className="input input-bordered w-full"
                            {...register("bikeBrand", { required: true })}
                        />
                    </div>

                    <div>
                        <label className="label">Bike Registration Number</label>
                        <input
                            className="input input-bordered w-full"
                            {...register("bikeRegistration", { required: true })}
                        />
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <label className="label">Riding Experience (years)</label>
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        {...register("experience")}
                    />
                </div>

                <button className="btn btn-primary w-full mt-4">
                    Submit Application
                </button>

            </form>
        </div>
    );
};

export default BeARider;
