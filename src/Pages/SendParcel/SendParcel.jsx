import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";



const SendParcel = () => {
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            type: "document",
            senderEmail: user?.email || "",
        },
    });
    const coverageData = useLoaderData();

    const axiosSecure = useAxiosSecure()

    // Create region -> districts mapping
    const regionDistrictMap = coverageData.reduce((acc, item) => {
        if (!acc[item.region]) acc[item.region] = [];
        if (!acc[item.region].includes(item.district)) acc[item.region].push(item.district);
        return acc;
    }, {});

    const type = watch("type");
    const senderRegion = watch("senderRegion");
    const receiverRegion = watch("receiverRegion");
    // const [calculatedCost, setCalculatedCost] = useState(null);

    const calculateDeliveryCost = (data) => {
        const { type, weight, senderDistrict, receiverDistrict } = data;
        const withinCity = senderDistrict === receiverDistrict;

        let baseCost = 0;
        let extraWeightCost = 0;
        let outsideCityFee = 0;

        if (type === "document") {
            baseCost = withinCity ? 60 : 80;
            if (!withinCity) outsideCityFee = 20; // The difference from 60 to 80
        } else {
            const w = parseFloat(weight) || 0;

            if (w <= 3) {
                baseCost = withinCity ? 110 : 150;
                if (!withinCity) outsideCityFee = 40;
            } else {
                const extraKg = w - 3;
                baseCost = withinCity ? 110 : 150;
                extraWeightCost = 40 * extraKg;
                if (!withinCity) outsideCityFee = 40;
            }
        }

        const cost = baseCost + extraWeightCost + outsideCityFee;

        const totalCost = parseInt(cost)

        return {
            baseCost,
            extraWeightCost,
            outsideCityFee,
            totalCost,
            withinCity,
            weight: parseFloat(weight) || 0
        };
    };

    // Placeholder saveParcel
    const saveParcel = (parcelData) => {
        axiosSecure.post('/parcels', parcelData)
            .then((res) => {
                console.log(res.data);
                if (res.data.insertedId) {
                    toast.success("Parcel created successfully!", { duration: 4000 });
                }
            })
    };
    const onSubmit = (data) => {
        const costBreakdown = calculateDeliveryCost(data);

        const dataWithBreakdown = {
            ...data,
            cost: costBreakdown.totalCost,
            deliveryZone: costBreakdown.withinCity ? 'Within City' : 'Outside City/District',
            userEmail: user?.email,
            // userId: user?.uid || user?.id,
            status: 'pending',
            paymentStatus: 'unpaid',
            deliveryStatus: 'not-collected',
            trackingNumber: generateTrackingNumber(),
            creationDate: new Date().toISOString(),
            createdAtTimestamp: Date.now(),
        };

        toast.custom(
            (t) => (
                <div className="bg-white border rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-primary">Delivery Cost Breakdown</h3>

                    {/* Pricing Details */}
                    <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Parcel Type:</span>
                            <span className="font-medium text-black capitalize">{data.type}</span>
                        </div>
                        {data.type === "non-document" && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-medium text-black">{costBreakdown.weight.toFixed(2)} kg</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Zone:</span>
                            <span className="font-medium text-black">{dataWithBreakdown.deliveryZone}</span>
                        </div>

                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Base Cost:</span>
                                <span className="font-medium text-black">{costBreakdown.baseCost} BDT</span>
                            </div>
                            {costBreakdown.extraWeightCost > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Extra Weight ({(costBreakdown.weight - 3).toFixed(2)} kg):</span>
                                    <span className="font-medium text-black">{costBreakdown.extraWeightCost.toFixed(2)} BDT</span>
                                </div>
                            )}
                            {costBreakdown.outsideCityFee > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Outside City Fee:</span>
                                    <span className="font-medium text-black">{costBreakdown.outsideCityFee} BDT</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-gray-800">Total Cost:</span>
                                <span className="text-green-900">{costBreakdown.totalCost.toFixed(2)} BDT</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button
                            className="btn btn-outline btn-neutral flex-1"
                            onClick={() => {
                                toast.dismiss(t.id);
                            }}
                        >
                            Edit Details
                        </button>
                        <button
                            className="btn btn-primary flex-1"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                await saveParcel(dataWithBreakdown);
                            }}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                position: 'top-center',
            }
        );
    };

    const generateTrackingNumber = () => {
        const prefix = 'PKG';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <Toaster
                position="top-center" // default position, we override for custom toast
                reverseOrder={false}
            />
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Send a Parcel</h1>
                <p className="text-neutral mt-2">Fill the form to schedule a door-to-door delivery</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Parcel Info */}
                <div className="border rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Parcel Info</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Radio buttons for type */}
                        <div className="form-control w-full lg:col-span-3">
                            <label className="label mb-2">Type</label>
                            <div className="flex gap-6">
                                <label className="cursor-pointer flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="document"
                                        className="radio radio-primary"
                                        {...register("type", { required: true })}
                                        defaultChecked
                                    />
                                    Document
                                </label>
                                <label className="cursor-pointer flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="non-document"
                                        className="radio radio-primary"
                                        {...register("type", { required: true })}
                                    />
                                    Non-Document
                                </label>
                            </div>
                            {errors.type && <span className="text-red-500">Parcel type is required</span>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">Parcel Name</label>
                            <input
                                type="text"
                                placeholder="Describe your parcel"
                                className="input input-bordered bg-base-200 w-full"
                                {...register("parcelName", { required: true })}
                            />
                            {errors.parcelName && <span className="text-red-500">Parcel Name is required</span>}
                        </div>

                        {type === "non-document" && (
                            <div className="form-control w-full">
                                <label className="label">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Parcel weight"
                                    className="input input-bordered bg-base-200 w-full"
                                    {...register("weight")}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender & Receiver side by side on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sender Info */}
                    <div className="border rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Sender Info</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="input input-bordered bg-base-200 w-full"
                                {...register("senderName", { required: true })}
                            />
                            <input
                                type="email"
                                className="input input-bordered bg-base-200 w-full cursor-not-allowed"
                                readOnly
                                {...register("senderEmail")}
                                value={user?.email}
                            />
                            <input
                                type="text"
                                placeholder="Contact"
                                className="input input-bordered bg-base-200 w-full"
                                {...register("senderContact", { required: true })}
                            />
                            <select
                                className="select select-bordered w-full"
                                {...register("senderRegion", { required: true })}
                            >
                                <option value="">Select Region</option>
                                {Object.keys(regionDistrictMap).map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="select select-bordered w-full"
                                {...register("senderDistrict", { required: true })}
                                disabled={!senderRegion}
                            >
                                <option value="">Select District</option>
                                {senderRegion &&
                                    regionDistrictMap[senderRegion].map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                            </select>
                            <textarea
                                placeholder="Address"
                                className="textarea textarea-bordered w-full"
                                {...register("senderAddress", { required: true })}
                            />
                            <textarea
                                placeholder="Pickup Instruction"
                                className="textarea textarea-bordered w-full"
                                {...register("pickupInstruction", { required: true })}
                            />
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="border rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Receiver Info</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="input input-bordered bg-base-200 w-full"
                                {...register("receiverName", { required: true })}
                            />
                            {/* ADD THIS ENTIRE BLOCK (OPTIONAL) */}
                            <input
                                type="email"
                                placeholder="Email (optional)"
                                className="input input-bordered bg-base-200 w-full"
                                {...register("receiverEmail", {
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.receiverEmail && <span className="text-red-500 text-sm">{errors.receiverEmail.message}</span>}
                            {/* END OF BLOCK */}
                            <input
                                type="text"
                                placeholder="Contact"
                                className="input input-bordered bg-base-200 w-full"
                                {...register("receiverContact", { required: true })}
                            />
                            <select
                                className="select select-bordered w-full"
                                {...register("receiverRegion", { required: true })}
                            >
                                <option value="">Select Region</option>
                                {Object.keys(regionDistrictMap).map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="select select-bordered w-full"
                                {...register("receiverDistrict", { required: true })}
                                disabled={!receiverRegion}
                            >
                                <option value="">Select District</option>
                                {receiverRegion &&
                                    regionDistrictMap[receiverRegion].map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                            </select>
                            <textarea
                                placeholder="Address"
                                className="textarea textarea-bordered w-full"
                                {...register("receiverAddress", { required: true })}
                            />
                            <textarea
                                placeholder="Delivery Instruction"
                                className="textarea textarea-bordered w-full"
                                {...register("deliveryInstruction", { required: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendParcel;
