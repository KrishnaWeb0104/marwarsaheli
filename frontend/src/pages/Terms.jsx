import React from "react";

const Terms = () => {
  return (
    <div className="relative  overflow-hidden">
      {/* full bleed background */}
      <img
        src="/Behind-Products.webp"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
      <div className="max-w-2xl mx-auto p-10">
        {/* content up top */}
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold text-center mb-6">
            Terms and Conditions
          </h1>
          <p className="text-black text-lg leading-relaxed text-justify space-y-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            efficitur velit sit amet ligula elementum, vitae fringilla arcu
            suscipit. Ut sed diam a neque dictum accumsan. Integer tristique
            nisi id augue viverra, nec condimentum nulla imperdiet. Suspendisse
            congue, nibh sed euismod convallis, odio nulla venenatis lectus, nec
            fermentum justo lacus sit amet velit. Fusce pellentesque ligula
            odio, in iaculis lectus sollicitudin sed. Donec ac quam nibh. Nullam
            eget dolor felis. Donec semper fermentum condimentum.
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            efficitur velit sit amet ligula elementum, vitae fringilla arcu
            suscipit. Ut sed diam a neque dictum accumsan. Integer tristique
            nisi id augue viverra, nec condimentum nulla imperdiet. Suspendisse
            congue, nibh sed euismod convallis, odio nulla venenatis lectus, nec
            fermentum justo lacus sit amet velit. Fusce pellentesque ligula
            odio, in iaculis lectus sollicitudin sed. Donec ac quam nibh. Nullam
            eget dolor felis. Donec semper fermentum condimentum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
