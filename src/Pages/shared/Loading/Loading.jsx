import { FaTruckMoving } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";

const Loading = ({
    main = "📦 Your parcel is on the move…",
    sub = "Our delivery hamsters are running as fast as they can 🐹💨"
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">

            {/* Animated Icons */}
            <div className="flex items-center gap-4">
                <BsBoxSeam className="text-4xl text-primary animate-bounce" />
                <FaTruckMoving className="text-5xl text-primary animate-pulse" />
            </div>

            {/* DaisyUI Loader */}
            <span className="loading loading-dots loading-lg text-primary"></span>

            {/* Messages */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                    {main}
                </h3>
                <p className="text-sm opacity-70">
                    {sub}
                </p>
            </div>

        </div>
    );
};

export default Loading;