
const ServiceCard = ({ service }) => {

    const { icon: Icon, title, description } = service;

    return (
        <div
            className="
        card bg-base-100 shadow-md transition-all duration-300
        hover:bg-[#CAEB66] hover:shadow-xl
        group
      "
        >
            <div className="card-body items-center text-center space-y-3">

                {/* Icon */}
                <div className="
          text-primary text-4xl transition-colors duration-300
          group-hover:text-black
        ">
                    <Icon />
                </div>

                {/* Title */}
                <h3 className="
          card-title text-lg font-semibold transition-colors duration-300
          group-hover:text-black
        ">
                    {title}
                </h3>

                {/* Description */}
                <p className="
          text-sm text-secondary transition-colors duration-300
          group-hover:text-black
        ">
                    {description}
                </p>

            </div>
        </div>
    );
};

export default ServiceCard;
