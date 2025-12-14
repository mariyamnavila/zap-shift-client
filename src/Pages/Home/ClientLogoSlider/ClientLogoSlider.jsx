import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

// import your logos
import logo1 from "../../../assets/brands/amazon.png";
// import logo1 from "../assets/logos/logo1.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/star.png";
import logo7 from "../../../assets/brands/start_people.png";

const logos = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
];

const ClientLogoSlider = () => {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Heading */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold">Trusted by Our Clients</h2>
          <p className="text-neutral-content/80">
            Leading brands trust us for fast and reliable delivery
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={4000} // controls smoothness
          autoplay={{
            delay: 0, // IMPORTANT: makes it continuous
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={2}
          spaceBetween={100}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="client-logo-slider"
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center">
                <img
                  src={logo}
                  alt="Client logo"
                  className="h-10 object-contain transition"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ClientLogoSlider;
