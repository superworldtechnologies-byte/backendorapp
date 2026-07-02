'use client';

import PawIcon from '@/icons/icon1';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

const dogImages = [
    'https://images.unsplash.com/photo-1517849845537-4d257902454a',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
    'https://images.unsplash.com/photo-1525253086316-d0c936c814f8',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2',
];

export default function GallerySection() {
    // Observers for header and gallery entries
    const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.15 });
    const { ref: galleryRef, inView: galleryInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section className="py-24 overflow-hidden bg-white">
            <div ref={headerRef} className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 text-center">
                    {/* Tag Label */}
                    <div className={cn(
                        "mb-4 flex items-center justify-center gap-2 transition-all duration-700 ease-out transform",
                        headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}>
                        <PawIcon size={18} className="fill-[#FFC357] text-[#FFC357]" />
                        <span className="text-[17px] text-zinc-800">
                            Gallery
                        </span>
                    </div>

                    {/* Main Title */}
                    <h2 className={cn(
                        "mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl leading-tight text-zinc-800 transition-all duration-700 delay-100 ease-out transform",
                        headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        Happy moments with the pets
                        <br className="hidden sm:block" />
                        that brighten our days
                    </h2>
                </div>
            </div>

            {/* Infinite Gallery Wrapper */}
            <div 
                ref={galleryRef}
                className={cn(
                    "flex gap-5 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform",
                    galleryInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
                )}
            >
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="flex shrink-0 gap-5 animate-logo-cloud"
                    >
                        {dogImages.map((img, index) => (
                            <div
                                key={`${i}-${index}`}
                                className={cn(
                                    `relative overflow-hidden rounded-3xl shadow-lg shrink-0`,
                                    index % 3 === 0
                                        ? 'h-[380px] w-[280px]'
                                        : index % 2 === 0
                                            ? 'h-[320px] w-[240px]'
                                            : 'h-[420px] w-[300px]'
                                )}
                            >
                                <img
                                    src={`${img}?auto=format&fit=crop&w=800&q=80`}
                                    alt={`Dog ${index + 1}`}
                                    className="object-cover transition duration-500 h-full w-full hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}