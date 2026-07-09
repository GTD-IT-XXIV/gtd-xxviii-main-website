"use client"; 

import React, { useState } from 'react'

export default function HeroSection() {
    const images = [
        "/images/about_us/1.JPG",
        "/images/about_us/2.JPG",
        "/images/about_us/3.JPG",
        "/images/about_us/4.JPG"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6 md:p-10 text-white">
            <style>{`
                @font-face {
                    font-family: 'title';
                    src: url('/fonts/LibreBaskerville-VariableFont_wght.ttf') format('truetype');
                    font-display: swap;
                }

                @font-face {
                    font-family: 'paragraph';
                    src: url('/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype');
                    font-display: swap;
                }
            `}</style>

            <div className="flex flex-col items-center mb-8 md:mb-10 w-full max-w-6xl">
                <div className="flex justify-center items-center text-center">
                    <span><img src="/images/star.png" alt="" className="h-4 md:h-5 mx-3 md:mx-5" /></span>
                    <h1
                        className="text-4xl md:text-5xl font-bold tracking-wider text-[#EFECE6]"
                        style={{ fontFamily: "'title'" }}
                    >About Pintu GTD</h1>
                    <span><img src="/images/star.png" alt="" className="h-4 md:h-5 mx-3 md:mx-5" /></span>
                </div>
                
                <img src="/images/divider.png" alt="" className="h-5 md:h-8 my-3" />
                
                <div className="px-4">
                    <p
                        className="text-base md:text-lg text-center"
                        style={{ fontFamily: "'paragraph'" }}
                    >Discover the story behind Get Together Day, Singapore's premier</p>
                    <p
                        className="text-base md:text-lg text-center"
                        style={{ fontFamily: "'paragraph'" }}
                    >Indonesian freshmen orientation at NTU.</p>
                </div>
            </div>

            {/* TWO-COLUMN CONTENT SECTION */}
            {/* grid-cols-1 stacks them on mobile, md:grid-cols-2 side-by-side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl items-center w-full">
                
                {/* Left Column: Text */}
                <div
                    className="flex flex-col gap-4 md:gap-6 text-left leading-relaxed text-sm md:text-base tracking-wide"
                    style={{ fontFamily: "'ParagraphFont', sans-serif" }}
                >
                    <p>
                        <strong className="font-bold text-white text-base md:text-lg">Get Together Day (GTD)</strong> is a Freshmen Orientation Camp, managed and run by Indonesian student volunteers, that is held every year to welcome Indonesian freshmen who will pursue their higher education at NTU.
                    </p>
                    <p>
                        Through its 28 years of existence, GTD has been fulfilling its mission to familiarise freshmen with Singapore and to integrate them with the Indonesian community in NTU.
                    </p>
                    <p>
                        GTD is designed and specially planned for freshmen to bond with their fellow freshmen and seniors. The orientation group (also known as OG) will be their first family in Singapore, before they get to know their course mates.
                    </p>
                    <p>
                        With the exciting activities planned by the committees over 4 days, freshmen will get the chance to mingle with Indonesian cohorts in NTU and to have great fun, all at the same time.
                    </p>
                </div>

                {/* Right Column: Image Carousel */}
                <div className="flex flex-col items-center w-full mt-6 md:mt-0">
                    
                    <div className="w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-600 shadow-xl aspect-[4/3] flex items-center justify-center bg-black">
                        <img
                            src={images[currentIndex]}
                            alt={`GTD Orientation ${currentIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-4 md:gap-6 mt-4 md:mt-6">
                        <button 
                            onClick={handlePrev}
                            className="text-white hover:text-gray-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <div className="flex gap-2 md:gap-3">
                            {images.map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                                        currentIndex === index ? 'bg-[#fdecd5]' : 'bg-gray-500'
                                    }`}
                                ></div>
                            ))}
                        </div>

                        <button 
                            onClick={handleNext}
                            className="text-white hover:text-gray-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
