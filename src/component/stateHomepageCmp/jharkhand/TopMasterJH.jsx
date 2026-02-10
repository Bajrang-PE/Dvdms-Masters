import React, { useState, useEffect } from "react";

const TopMasterJH = ({ image }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover scale-105 animate-[zoom-out_10s_ease-in-out_infinite]"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div
          className={`h-75 max-w-lg w-full rounded-2xl backdrop-blur-xl bg-white/15 border border-white/20 text-white p-4 shadow-2xl transition-all duration-1000 ease-out
            ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <h2 className="text-3xl font-semibold tracking-wide text-center mb-4">
            Circulars
          </h2>

          <div className="flex flex-col items-center gap-3">

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              No circulars available
            </div>

            {/* Optional button (future ready) */}
            {/* <button
              disabled
              className="mt-4 px-6 py-2 rounded-lg bg-white/20 text-white/70 cursor-not-allowed text-sm"
            >
              View Archive
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopMasterJH;
