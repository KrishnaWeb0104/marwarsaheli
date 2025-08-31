import React from "react";

// ...existing code...
const AboutUs = () => {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <header className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#bd1a12]">
            Our Story
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-700">
            Crafted with Heart.
          </p>
          <div className="mt-6 h-1 w-24 sm:w-32 mx-auto bg-[#bd1a12]/20 rounded-full" />
        </header>

        <article className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-neutral-200 shadow-sm p-5 sm:p-8">
          <p className="text-neutral-800 text-sm sm:text-base leading-relaxed">
            <span className="inline-block mr-2 text-2xl text-[#bd1a12]" aria-hidden="true">“</span>
            Powered by Purpose Hearts With Fingers was born from a simple belief:
            women’s equality begins with economic empowerment. Our roots trace back
            to Sakhi, a CSR initiative by Hindustan Zinc, that began mobilising
            women in remote villages of Rajasthan and Uttarakhand into Self Help
            Groups (SHGs) backing 2016. Today, these SHGS have become spaces of
            learning, sharing, and transformation. With skills training and access
            to finance, women are producing handcrafted goods—each item a reflection
            of their resilience and creativity.
            <span className="inline-block ml-2 text-2xl text-[#bd1a12]" aria-hidden="true">”</span>
          </p>
        </article>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white" />
    </main>
  );
};
// ...existing code...

export default AboutUs;