import React from "react";

const OurHistory = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/OurHistory-BG.webp"
          className="w-full h-full object-cover opacity-30"
          alt="Background"
        />
      </div>

      {/* Section Title */}
      <div className="relative flex justify-center py-8 sm:py-10 px-4">
        <h1 className="text-[#BD1A12] text-2xl sm:text-4xl font-bold">
          Our History
        </h1>
      </div>

      {/* Content */}
      <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 px-4 sm:px-10 lg:px-20 py-6 sm:py-10">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src="/OurHistory.webp"
            alt="History Visual"
            className="w-64 sm:w-80 md:w-[450px] object-cover rounded-xl"
          />
        </div>

        {/* Text + Button */}
        <div className="max-w-2xl space-y-5 text-center lg:text-left">
          <p className="text-[#000000] font-medium text-sm sm:text-base lg:text-xl leading-relaxed tracking-tight">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
            perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="py-2 px-8 bg-[#543210] text-white rounded-md text-sm sm:text-base">
              More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurHistory;
