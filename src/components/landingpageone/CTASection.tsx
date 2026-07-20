import React from 'react';
import Reveal from './Reveal';

const defaultCtaData = {
    image: {
        src: "/cta.avif",
        alt: "Freshly groomed happy dog being brushed"
    },
    heading: (
        <>Book a session &amp; feel <br className="hidden sm:inline" /> the difference today</>
    ),
    description: "Nothing beats seeing your happy, freshly groomed pet run to you.",
    cta: {
        label: "Book A Schedule"
    }
};

export default function CtaSection({ data = defaultCtaData }) {
    return (
        <section className="relative w-full overflow-hidden bg-[#FAF3EC] px-6 py-20 md:px-12 md:py-32 lg:px-20">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <img
                    className="h-full w-full object-cover object-right md:object-center"
                    src={data.image.src}
                    alt={data.image.alt}
                />
                {/* Dynamic Gradient Mask overlay for high text legibility */}
                <div 
                    className="absolute inset-0 mix-blend-normal"
                    style={{
                        background: `linear-gradient(243deg, rgba(255, 255, 255, 0) 20%, rgba(250, 243, 236, 0.8) 50%, rgba(250, 243, 236, 1) 80%)`
                    }}
                />
                <div 
                    className="absolute inset-0 hidden md:block"
                    style={{
                        background: `radial-gradient(circle at left, rgba(250, 243, 236, 0.9) 30%, rgba(250, 243, 236, 0.2) 70%, rgba(250, 243, 236, 0) 100%)`
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-[1272px]">
                <div className="flex max-w-[540px] flex-col items-start gap-8 md:gap-10">
                    
                    {/* Typography Group (Slides in from the left) */}
                    <Reveal animation="left" className="flex flex-col gap-4">
                        <h2 className="text-balance font-sans text-3xl font-medium tracking-[-1.5px] leading-[1.15] text-[#1E0C05] sm:text-4xl md:text-5xl">
                            {data.heading}
                        </h2>
                        <p className="text-pretty font-sans text-base leading-relaxed text-[#625B5B] sm:text-lg">
                            {data.description}
                        </p>
                    </Reveal>

                    {/* Action Button (Slides up with a subtle delay) */}
                    <Reveal animation="up" delay="delay-150">
                        <button 
                            type="button" 
                            className="group relative flex items-center justify-center gap-3.5 overflow-hidden rounded-2xl bg-[#A35C38] px-[22px] py-3.5 text-base font-medium text-[#FDFDFD] transition-all duration-300 hover:bg-[#8C4E2F] hover:shadow-lg active:scale-[0.98]"
                        >
                            <svg 
                                className="h-5 w-5 shrink-0 text-[#FDFDFD] transition-transform duration-300 group-hover:scale-110" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            
                            <span>{data.cta.label}</span>

                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        </button>
                    </Reveal>
                    
                </div>
            </div>
        </section>
    );
}