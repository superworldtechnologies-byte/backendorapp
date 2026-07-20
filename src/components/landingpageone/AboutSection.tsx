import React from 'react';
import Image from 'next/image';
import { CircleCheck, ArrowRight } from 'lucide-react';
import Reveal from './Reveal'; // Import the client wrapper

const defaultAboutData = {
  
    heading: (
        <>We care for pets <br className="hidden sm:block" /> like they're our own</>
    ),
    description: "Petocare started with a simple idea — every pet deserves loads of love, patience, and expert care. From our very first client to our thousandth, we've always put pets first.",
    features: [
        "8+ years of professional pet care experience",
        "1,200+ happy pets served",
        "Trusted by families across the city"
    ],
    cta: {
        label: "About Petocare"
    }
};

export default function AboutSection({ data = defaultAboutData }) {
    return (
        <section className="bg-[#fffaf8] py-20 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[108px] items-center">

                    {/* Left Column: Image (Slides from Left) */}
                    <Reveal animation="left" className="relative w-full max-w-[552px] mx-auto lg:mx-0 aspect-[552/640] rounded-3xl overflow-hidden shadow-sm">
                        <Image
                            src= "/feature-image1.avif"
                            alt="Man petting a golden retriever in a sunny living room"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </Reveal>

                    {/* Right Column: Content */}
                    <div className="flex flex-col gap-10 lg:gap-[72px] max-w-[548px] mx-auto lg:mx-0">

                        {/* Heading & Paragraph (Slides from Right) */}
                        <Reveal animation="right" className="flex flex-col gap-6">
                            <h2 className="text-[#1e0c05] font-medium text-4xl md:text-5xl lg:text-[48px] leading-[1.2] tracking-[-1.5px]">
                                {data.heading}
                            </h2>
                            <p className="text-[#625b5b] text-base md:text-[18px] leading-[1.6]">
                                {data.description}
                            </p>
                        </Reveal>

                        {/* Feature List & Button */}
                        <div className="flex flex-col gap-8 lg:gap-10">
                            
                            <ul className="flex flex-col gap-4">
                                {data.features.map((feature, index) => {
                                    // Stagger the delay for each list item: 150, 300, 500...
                                    const delays = ["delay-150", "delay-300", "delay-500"];
                                    return (
                                        <Reveal key={index} animation="up" delay={delays[index] || "delay-700"}>
                                            <li className="flex items-center gap-3">
                                                <CircleCheck
                                                    className="w-5 h-5 text-[#8c863a] flex-shrink-0"
                                                    strokeWidth={1.5}
                                                />
                                                <span className="text-[#1e0c05] font-medium text-base md:text-[18px] leading-[1.6]">
                                                    {feature}
                                                </span>
                                            </li>
                                        </Reveal>
                                    );
                                })}
                            </ul>

                            {/* Button (Slides up last) */}
                            <Reveal animation="up" delay="delay-700">
                                <button className="group relative bg-[#a35c38] text-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2.5 w-fit overflow-hidden hover:bg-[#8a4e2f] transition-colors duration-300">
                                    <span className="font-medium text-[16px] whitespace-nowrap">
                                        {data.cta.label}
                                    </span>
                                    <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-45deg] group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                                </button>
                            </Reveal>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}