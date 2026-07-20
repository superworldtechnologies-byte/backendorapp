import React from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import Reveal from './Reveal';

const defaultGalleryData = {
    heading: "See it to believe it",
    description: "Every photo shows care and skill. Browse our gallery to see the Petocare difference — one happy pet at a time.",
    items: [
        {
            id: 1,
            before: '/b.avif',
            after: '/a.avif',
            alt: 'Golden Retriever grooming',
        },
        {
            id: 2,
            before: '/bb.avif',
            after: '/aa.avif',
            alt: 'Long-haired cat grooming',
        },
        {
            id: 3,
            before: '/bbb.avif',
            after: '/aaa.avif',
            alt: 'Poodle grooming',
        },
    ]
};

export default function GallerySection({ data = defaultGalleryData }) {
    const horizontalDelays = ["delay-0", "delay-150", "delay-300"];

    return (
        <section className="bg-[#fffaf8] py-20 w-full overflow-hidden">
            <div className="mx-auto px-6 md:px-12 flex flex-col items-center">

                {/* Header Block (Slides Down) */}
                <Reveal animation="down" className="flex flex-col items-center text-center max-w-[628px] mb-16 lg:mb-[94px]">
                    <h2 className="text-[#1e0c05] font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4">
                        {data.heading}
                    </h2>
                    <p className="text-[#625b5b] text-base md:text-[18px] leading-[1.6] max-w-[537px]">
                        {data.description}
                    </p>
                </Reveal>

                {/* Gallery Matrix Wrapper (Scrollable on Mobile) */}
                <div className="w-full overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
                    <div className="min-w-[800px] max-w-[1140px] mx-auto flex flex-col">

                        {/* ROW 1: BEFORE (Slides in from Left) */}
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-[100px] right-0 h-px bg-[#ece5de] top-1/2 -translate-y-1/2 z-0" />

                            <Reveal animation="left" className="w-[120px] flex-shrink-0 z-10 bg-[#fffaf8]">
                                <div className="bg-[#faf3ec] border border-[#ece5de] rounded-xl px-4 py-2 text-center text-[#1e0c05]/70 font-semibold text-[16px] inline-block">
                                    Before
                                </div>
                            </Reveal>

                            <div className="flex-1 grid grid-cols-3 gap-8 z-10">
                                {data.items.map((item, index) => (
                                    <Reveal key={`before-${item.id}`} animation="left" delay={horizontalDelays[index]}>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf3ec] shadow-sm">
                                            <Image
                                                src={item.before}
                                                alt={`Before ${item.alt}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 33vw, 300px"
                                            />
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        {/* ROW 2: ARROWS (Pops up gently) */}
                        <div className="flex w-full py-8">
                            <div className="w-[120px] flex-shrink-0" />
                            <div className="flex-1 grid grid-cols-3 gap-8">
                                {data.items.map((item, index) => (
                                    <Reveal key={`arrow-${item.id}`} animation="scale" delay={horizontalDelays[index]} className="flex justify-center items-center">
                                        <ArrowDown className="text-[#8c863a] w-5 h-5 stroke-[2]" />
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        {/* ROW 3: AFTER (Slides in from Right) */}
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-[100px] right-0 h-px bg-[#ece5de] top-1/2 -translate-y-1/2 z-0" />

                            <Reveal animation="right" className="w-[120px] flex-shrink-0 z-10 bg-[#fffaf8]">
                                <div className="bg-[#faf3ec] border border-[#ece5de] rounded-xl px-4 py-2 text-center text-[#1e0c05]/70 font-semibold text-[16px] inline-block">
                                    After
                                </div>
                            </Reveal>

                            <div className="flex-1 grid grid-cols-3 gap-8 z-10">
                                {data.items.map((item, index) => (
                                    <Reveal key={`after-${item.id}`} animation="right" delay={horizontalDelays[index]}>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf3ec] shadow-sm">
                                            <Image
                                                src={item.after}
                                                alt={`After ${item.alt}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 33vw, 300px"
                                            />
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}