import {
    FaShippingFast,
    FaGlobeAsia,
    FaBoxes,
    FaMoneyBillWave,
    FaBuilding,
    FaUndo,
} from "react-icons/fa";
import ServiceCard from "./ServiceCard";


const services = [
    {
        title: "Express & Standard Delivery",
        description:
            "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
        icon: FaShippingFast,
    },
    {
        title: "Nationwide Delivery",
        description:
            "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
        icon: FaGlobeAsia,
    },
    {
        title: "Fulfillment Solution",
        description:
            "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
        icon: FaBoxes,
    },
    {
        title: "Cash on Home Delivery",
        description:
            "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
        icon: FaMoneyBillWave,
    },
    {
        title: "Corporate Service / Contract In Logistics",
        description:
            "Customized corporate services which includes warehouse and inventory management support.",
        icon: FaBuilding,
    },
    {
        title: "Parcel Return",
        description:
            "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
        icon: FaUndo,
    },
];

const Services = () => {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <h2 className="text-4xl font-bold">Our Services</h2>
                    <p className="text-neutral-content/80">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                        From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;