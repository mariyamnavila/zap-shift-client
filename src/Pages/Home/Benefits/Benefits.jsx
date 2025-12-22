import BenefitCard from "./BenefitCard";
import live from '../../../assets/live-tracking.png';
import safe from '../../../assets/safe-delivery.png';
import call from '../../../assets/safe-delivery.png';

const benefits = [
    {
        id: 1,
        title: "Live Parcel Tracking",
        description:
            "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
        image: live,
    },
    {
        id: 2,
        title: "100% Safe Delivery",
        description:
            "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
        image: safe,
    },
    {
        id: 3,
        title: "24/7 Call Center Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
        image: call,
    },
];

const Benefits = () => {
    return (
        <section className="py-16 bg-base-200">
            <div className="max-w-7xl mx-auto px-4">

                {/* Section Header */}
                <div className="text-center mb-12 space-y-3">
                    <h2 className="text-4xl font-bold">Why Choose Us</h2>
                    <p className="text-secondary">
                        Smart logistics solutions designed for speed, safety, and reliability
                    </p>
                </div>

                {/* Benefit Cards */}
                <div className="space-y-6">
                    {benefits.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            {...benefit}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Benefits;
