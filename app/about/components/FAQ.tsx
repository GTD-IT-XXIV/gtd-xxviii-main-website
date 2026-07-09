"use client";
import React, { useState } from 'react';
import Image from 'next/image';

export default function FAQ() {
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    const faqs = [
        {
            question: "What are the differences between GTD and school/hall orientation?",
            answer: "Our orientation is solely for Indonesian students who are studying in NTU, all programmes are welcome to join. Our aim is to foster freshies with Indonesian community in NTU."
        },
        {
            question: "How can I register?",
            answer: "You can register yourself by filling up the registration form attached in this page. If you have further questions feel free to DM us on instagram @pintugtd. To reach us via telegram, please refer to the Contact Us section on this page."
        },
        {
            question: "Where, when, and how long will the programs be conducted?",
            answer: "Please refer to the Events page on our website."
        },
        {
            question: "How much does the orientation cost?",
            answer: "$30. This price includes our annual GTD T-Shirt, dinner & bus accommodation on August 4, and many more!"
        },
    ];

    const toggleAccordion = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

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
            <div className="flex items-center justify-center mb-12">
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
                    FAQ
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

            {/* Accordion List */}
            <div className="w-full max-w-3xl space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-[#041633]/60 backdrop-blur-md border border-[#1E3F66]/50 rounded-[32px] overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-[#244f80]/80 hover:bg-[#041633]/70"
                    >
                        <button
                            className="flex justify-between items-center w-full px-8 py-5 text-left text-white focus:outline-none cursor-pointer select-none"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className="font-['Inter'] font-semibold tracking-wider text-base md:text-lg text-white/90">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-white/80 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${openAccordion === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="pb-6 px-8 text-[#D1D5DB] font-['Inter'] text-sm md:text-base leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}