

const BenefitCard = ({ image, title, description }) => {
    return (
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition">
            <div className="card-body flex flex-col md:flex-row items-center md:items-stretch gap-6">

                {/* Left Image */}
                <div className="shrink-0 flex items-center justify-center">
                    <img
                        src={image}
                        alt={title}
                        className="h-[200px] w-[200px] object-contain"
                    />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-base-300"></div>

                {/* Right Content */}
                <div className="flex-1 flex items-center">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <p className="text-secondary leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default BenefitCard;
