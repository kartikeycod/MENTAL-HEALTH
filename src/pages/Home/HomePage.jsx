import React from "react";
import HeroSection from "../../components/HeroSection";
import AssureSection from "../../components/Assure";
import FeaturesSection from "../../components/FeaturesSection";
import FitnessAPISection from "../../components/FitnessAPISection";
import ToDo from "../../components/ToDo";
import Yoga from "../../components/yoga";
import AnalyticsSection from "../../components/AnalyticsSection";
import AboutSection from "../../components/AboutSection";
import TestimonialSection from "../../components/TestimonialSection";
import InteractiveCTA from "../../components/InteractiveCTA";
import Footer from "../../components/Footer";
import Upcoming from "../../Upcoming";

const HomePage = () => {
  return (
    <>
      <main>
        <HeroSection />
        <AssureSection />
        <FeaturesSection />
        <FitnessAPISection />
        <ToDo />
        <Yoga />
        <AnalyticsSection />
        <AboutSection />
        <TestimonialSection />
        <InteractiveCTA />
      </main>
      <Footer />
      <Upcoming />
    </>
  );
};

export default HomePage;
