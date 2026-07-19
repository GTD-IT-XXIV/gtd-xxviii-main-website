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
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Modal frame — PNG is the cream box with colored border */}
      <div
        className="relative w-full max-w-4xl"
        style={{
          backgroundImage: `url(/images/houses/${houseName}.png)`,
          backgroundSize: "100% 100%",
          borderRadius: "1.25rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 font-bold text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex justify-center gap-12 px-14 py-14">
          {ogs.map((og) => (
            <div key={og.name} className="flex flex-col items-center gap-2 flex-1">
              {/* OG photo */}
              <div className="w-full aspect-square rounded-xl overflow-hidden max-w-[280px]">
                <img src={og.image} alt={og.name} className="w-full h-full object-cover" />
              </div>

              {/* OG name + GL names, grouped tight */}
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
    </div>
  );
}
