import location from '../../../assets/location-merchant.png';

const BeMerchant = () => {
  return (
      <div data-aos='zoom-in-up' className="max-w-7xl mx-auto bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373d] rounded-4xl p-20">
        <div className="hero-content flex-col lg:flex-row-reverse">

          <img
            src={location}
            className="max-w-md rounded-lg"
          />

          <div>
            <h1 className="text-5xl font-bold text-white">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>
            <p className="py-6 text-white">
              We offer the lowest delivery charge with the highest value along with
              100% safety of your product. Pathao courier delivers your parcels in
              every corner of Bangladesh right on time.
            </p>
            <button className="btn btn-primary text-black rounded-full">Become a Merchant</button>
            <button className="btn btn-primary btn-outline text-primary hover:text-black ms-4 rounded-full">Earn with ZapShift Courier</button>
          </div>

        </div>
      </div>
  );
};


export default BeMerchant;