"use client";

/* eslint-disable @next/next/no-img-element */

interface OG {
  name: string;
  gls: string[];
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
            <div key={og.name} className="flex flex-col items-center gap-4 flex-1">
              {/* Placeholder photo */}
              <div className="w-full aspect-square rounded-xl bg-gray-300 flex items-center justify-center text-gray-500 text-sm max-w-[280px]">
                Photo
              </div>

              {/* OG name */}
              <p className="text-3xl font-bold text-gray-800 text-center">{og.name}</p>

              {/* GL names */}
              <div className="text-center text-gray-600 text-base space-y-1">
                {og.gls.map((gl, i) => (
                  <p key={i}>{gl}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
