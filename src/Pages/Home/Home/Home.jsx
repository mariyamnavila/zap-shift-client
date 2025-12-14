import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientLogoSlider from '../ClientLogoSlider/ClientLogoSlider';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientLogoSlider></ClientLogoSlider>
        </div>
    );
};

export default Home;