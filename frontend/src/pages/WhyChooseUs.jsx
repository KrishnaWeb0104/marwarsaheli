import React from "react";

const WhyChooseUs = () => {
  const womenCards = [
    {
      imageSrc: "/WhyChooseUs-1.webp",
      alt: "Women - 1",
      h1: "Gathering Nature’s Goodness",
      text: "Rajasthani women handpick every ingredient with care, keeping the natural richness and traditional touch alive from the start.",
    },
    {
      imageSrc: "/WhyChooseUs-2.webp",
      alt: "Women - 2",
      h1: "Handcrafting the Spices",
      text: "Using age-old recipes, rural women grind and blend each spice by hand, ensuring purity, aroma, and authentic flavor.",
    },
    {
      imageSrc: "/WhyChooseUs-3.webp",
      alt: "Women - 3",
      h1: "From Their Hands to Your Home",
      text: "Packed with love and pride, the final products are delivered fresh—bringing Rajasthan’s essence right to your kitchen.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#fff6ec] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/WhyChooseUsBg.webp"
          className="w-full h-full object-cover opacity-25"
          alt="Background"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-10 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl text-[#bd1a12] font-bold mb-4">
            Why Choose Us: Rooted in the Soil of Rajasthan
          </h1>
          <p className="text-base sm:text-xl text-black leading-relaxed max-w-4xl mx-auto">
            A Journey of Purity, Tradition, and Women’s Empowerment
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {womenCards.map((card, index) => (
            <div
              key={index}
              className="text-center flex flex-col items-center px-4"
            >
              <img
                src={card.imageSrc}
                alt={card.alt}
                className="w-56 h-56 sm:w-72 sm:h-72 object-cover mb-6 rounded-full"
              />
              <h2 className="text-lg sm:text-2xl font-bold text-[#bd1a12] mb-3">
                {card.h1}
              </h2>
              <p className="text-black text-sm sm:text-base font-medium tracking-tight leading-relaxed max-w-xs mb-6">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Images at Bottom */}
      <div className="absolute bottom-9 sm:bottom-14 w-full">
        <img
          src="/WhyChooseUs-Below-1.webp"
          className="w-full h-8 sm:h-10 object-contain"
          alt="Top Grass"
        />
      </div>

      <div className="absolute bottom-0 w-full">
        <img
          src="/WhyChooseUs-Below-5.webp"
          className="w-full h-12 sm:h-16 object-cover"
          alt="Track"
        />
      </div>

      {/* Tractor and Side Grass */}
      <div className="absolute bottom-0 left-4 sm:left-52 w-28 sm:w-40">
        <img
          src="/WhyChooseUs-Below-2.webp"
          className="w-full h-auto object-contain"
          alt="Tractor"
        />
      </div>

      <div className="absolute bottom-0 left-0 w-36 sm:w-96">
        <img
          src="/WhyChooseUs-Below-3.webp"
          className="w-full h-10 object-contain"
          alt="Left Grass"
        />
      </div>

      <div className="absolute bottom-0 right-0 w-24 sm:w-96">
        <img
          src="/WhyChooseUs-Below-4.webp"
          className="w-full h-10 object-contain"
          alt="Right Grass"
        />
      </div>
    </div>
  );
};

export default WhyChooseUs;
