import React from "react";

const OurSpeciality = () => {
  return (
    <div className="relative w-full bg-[#f8f0df] py-10 overflow-hidden">
      {/* Cards Container */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-stretch gap-6 px-4">
        {/* Cards */}
        {[
          {
            icon: "/OurSpeciality-1.webp",
            title: "COMPLETELY ORGANIC",
            desc: "Grown naturally without synthetic chemicals",
          },
          {
            icon: "/OurSpeciality-2.webp",
            title: "FREE FROM CHEMICALS",
            desc: "No added preservatives, colors, or flavor enhancers.",
          },
          {
            icon: "/OurSpeciality-3.webp",
            title: "CRAFTED WITH CARE",
            desc: "Handmade in hygienic spaces with special attention.",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="relative shadow-lg p-6 w-full md:w-1/3 overflow-hidden rounded-xl"
          >
            {/* Background Image */}
            <img
              src="/OurSpeciality.webp"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-85"
            />

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4">
              {/* Icon */}
              <img
                src={card.icon}
                alt="Icon"
                className="w-14 h-14 sm:w-16 sm:h-16"
              />

              {/* Text */}
              <div className="flex flex-col justify-start">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {card.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurSpeciality;
