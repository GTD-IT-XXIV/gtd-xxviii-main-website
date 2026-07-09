import React from 'react';
import Image from 'next/image';

export default function ContactUs() {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center py-6 md:py-10 px-4">
            {/* Inject custom font-faces */}
            <style>{`
                @font-face {
                    font-family: 'LibreBaskerville';
                    src: url('/fonts/LibreBaskerville-VariableFont_wght.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Inter';
                    src: url('/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
            `}</style>

            {/* Title Section */}
            <div className="flex items-center justify-center mb-8">
                {/* Left Star Image */}
                <Image
                    src="/images/star.png"
                    alt="star"
                    width={24}
                    height={24}
                    className="h-4 md:h-5 mx-4"
                    priority
                />

                <h3 className="text-4xl md:text-5xl font-bold tracking-wider text-[#EFECE6] font-['LibreBaskerville']">
                    Contact Us
                </h3>

                {/* Right Star Image */}
                <Image
                    src="/images/star.png"
                    alt="star"
                    width={24}
                    height={24}
                    className="h-4 md:h-5 mx-4"
                    priority
                />
            </div>

            {/* Cards Grid */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-stretch">
                {/* Telegram Card */}
                <a
                    href="https://t.me/sherynwu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#041633]/60 backdrop-blur-md border border-[#1E3F66]/50 rounded-[28px] p-8 flex items-center gap-6 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-[#244f80]/80 hover:bg-[#041633]/70 hover:scale-[1.02] cursor-pointer group"
                >
                    {/* Circle Icon Wrapper */}
                    <div className="w-20 h-20 rounded-full border border-[#1E3F66]/60 flex items-center justify-center transition-all duration-300 group-hover:border-[#244f80]/90">
                        <svg className="w-8 h-8 text-[#EFECE6] fill-current" viewBox="0 0 24 24">
                            <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634L21.075.903c.513-.171.764.048.6.577L16.2 21.424c-.167.524-.476.542-.69.04L11.75 13.5l-4.75 3.5v-4.5l8.75-8.75-10.75 9.75-3.054-4.185z" />
                        </svg>
                    </div>
                    {/* Info */}
                    <div className="flex flex-col">
                        <span className="font-['Inter'] font-semibold tracking-wider text-xl text-white">
                            TELEGRAM
                        </span>
                        <span className="font-['Inter'] text-white/60 text-base mt-1">
                            @sherynwu
                        </span>
                    </div>
                </a>

                {/* Instagram Card */}
                <a
                    href="https://instagram.com/pintugtd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#041633]/60 backdrop-blur-md border border-[#1E3F66]/50 rounded-[28px] p-8 flex items-center gap-6 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-[#244f80]/80 hover:bg-[#041633]/70 hover:scale-[1.02] cursor-pointer group"
                >
                    {/* Circle Icon Wrapper */}
                    <div className="w-20 h-20 rounded-full border border-[#1E3F66]/60 flex items-center justify-center transition-all duration-300 group-hover:border-[#244f80]/90">
                        <svg className="w-8 h-8 text-[#EFECE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </div>
                    {/* Info */}
                    <div className="flex flex-col">
                        <span className="font-['Inter'] font-semibold tracking-wider text-xl text-white">
                            INSTAGRAM
                        </span>
                        <span className="font-['Inter'] text-white/60 text-base mt-1">
                            @pintugtd
                        </span>
                    </div>
                </a>
            </div>
        </div>
    );
}