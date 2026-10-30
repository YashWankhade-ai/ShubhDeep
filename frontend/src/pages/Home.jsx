import React from "react";
import { Hero } from "../components/Hero";
import { Collections } from "../components/Collections";
import { DealOfTheDay } from "../components/DealOfTheDay";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { FestiveGifting } from "../components/FestiveGifting";
import { BrandStory } from "../components/BrandStory";
import { WhyShopWithUs } from "../components/WhyShopWithUs";
import { InstagramGallery } from "../components/InstagramGallery";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Collections />
      <DealOfTheDay />
      <FeaturedProducts />
      <FestiveGifting />
      <BrandStory />
      <WhyShopWithUs />
      <InstagramGallery />
    </div>
  );
};

export default Home;
