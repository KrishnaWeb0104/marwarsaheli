import React from "react";
import HomePage from "./HomePage";
import OurSpeciality from "../components/OurSpeciality";
import HandmadeTreasure from "./HandmadeTreasure";
import WhyChooseUs from "./WhyChooseUs";
import BestSellers from "./BestSellers";
import OurHistory from "./OurHistory";
import Testimonals from "./Testimonials";
import Deals from "./Deals";

const LandingPage = () => {
  return (
    <>
      <HomePage />
      <OurSpeciality />
      <HandmadeTreasure />
      <WhyChooseUs />
      <BestSellers />
      <OurHistory />
      <Testimonals />
      <Deals />
    </>
  );
};

export default LandingPage;
