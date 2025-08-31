import React from "react";

const Testimonials = () => {
  const testimonialsCards = [
    {
      imageSrc: "/WadeWarren.webp",
      backgroundImg: "/Testimonials-Cards.webp",
      alt: "Customer-1",
      name: "Wade Warren",
      stars: "★ ★ ★ ★",
      review:
        "Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Reprehenderit in voluptate velit esse ",
    },
    {
      imageSrc: "/RonaldRichards.webp",
      backgroundImg: "/Testimonials-Cards.webp",
      alt: "Customer-2",
      name: "Ronald Richards",
      stars: "★ ★ ★ ★",
      review:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
    },
    {
      imageSrc: "/JacobJones.webp",
      backgroundImg: "/Testimonials-Cards.webp",
      alt: "Customer-3",
      name: "Jacob Jones",
      stars: "★ ★ ★ ★",
      review:
        "Esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit ",
    },
  ];
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          src="/TestiMonials-BG.webp"
          alt=""
          className="w-screen h-[580px] object-top object-cover opacity-50"
        />
      </div>
      <div className="relative flex justify-center py-10">
        <h1 className="text-[#BD1A12] text-4xl font-bold">Testimonials</h1>
      </div>
      <div className="relative flex justify-center">
        <p className="text-xl text-black font-semibold leading-relaxed">
          What our Customers say about us
        </p>
      </div>

      <div className="relative overflow-hidden py-10">
        {/* Animation Styles */}
        <style>
          {`
            @keyframes scrollLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            .animate-slide {
              animation: scrollLeft 25s linear infinite;
            }
          `}
        </style>

        {/* Scrolling Container */}
        <div className="flex w-max animate-slide space-x-8 px-4">
          {[...testimonialsCards, ...testimonialsCards].map(
            ({ imageSrc, backgroundImg, alt, name, stars, review }, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 min-w-[320px] max-w-sm"
              >
                {/* Background image */}
                <img
                  src={backgroundImg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />

                {/* Card Content */}
                <div className="relative rounded-2xl shadow-lg p-6">
                  <img
                    src={imageSrc}
                    alt={alt}
                    className="w-16 h-16 rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                  <p className="text-yellow-500 mb-2">{stars}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
