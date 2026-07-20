"use client";

/* eslint-disable @next/next/no-img-element */

interface OG {
  name: string;
  gls: string[];
  image: string;
}

interface HouseModalProps {
  houseName: string;
  ogs: OG[];
  onClose: () => void;
}

export default function HouseModal({ houseName, ogs, onClose }: HouseModalProps) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-6 pt-24 sm:pt-6"
      onClick={onClose}
    >
      {/* Modal wrapper */}
      <div className="relative w-full max-w-4xl my-auto" onClick={(e) => e.stopPropagation()}>
        {/* House logo — centered, overlapping the top border */}
        <img
          src={`/images/houses/${houseName}_logo.PNG`}
          alt={`${houseName} logo`}
          className="absolute -top-24 sm:-top-16 left-1/2 -translate-x-1/2 w-[120px] sm:w-36 h-auto object-contain drop-shadow-lg pointer-events-none select-none z-10"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 font-bold text-xl leading-none z-10"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Desktop: single frame, OGs side by side (matches the PNG's designed aspect ratio) */}
        <div
          className="hidden sm:block"
          style={{
            backgroundImage: `url(/images/houses/${houseName}.png)`,
            backgroundSize: "100% 100%",
            borderRadius: "1.25rem",
          }}
        >
          <div className="flex justify-center gap-12 px-14 py-14">
            {ogs.map((og) => (
              <div key={og.name} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full aspect-square rounded-xl overflow-hidden max-w-[280px]">
                  <img src={og.image} alt={og.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-center gap-1" style={{ fontFamily: "Pixel, UncialAntiqua, serif" }}>
                  <p className="text-3xl font-bold text-gray-800 text-center">{og.name}</p>
                  <div className="text-center text-gray-600 text-base leading-tight space-y-0">
                    {og.gls.map((gl, i) => (
                      <p key={i}>{gl}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: each OG gets its own frame, stacked top to bottom, so the border art never has to stretch to an unnatural aspect ratio */}
        <div className="flex sm:hidden flex-col gap-6">
          {ogs.map((og) => (
            <div
              key={og.name}
              style={{
                backgroundImage: `url(/images/houses/${houseName}.png)`,
                backgroundSize: "100% 100%",
                borderRadius: "1.25rem",
              }}
            >
              <div className="flex flex-col items-center gap-0.5 px-6 pt-12 pb-16">
                <div className="w-full aspect-square rounded-xl overflow-hidden max-w-[190px] mx-auto">
                  <img src={og.image} alt={og.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-center gap-0 max-w-[230px] mx-auto" style={{ fontFamily: "Pixel, UncialAntiqua, serif" }}>
                  <p className="text-2xl font-bold text-gray-800 text-center">{og.name}</p>
                  <div className="text-center text-gray-600 text-sm leading-snug space-y-0">
                    {og.gls.map((gl, i) => (
                      <p key={i}>{gl}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
