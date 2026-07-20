'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PawIcon from "@/icons/icon1";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface IntroductionData {
  label: string;
  heading: React.ReactNode;
  description: React.ReactNode;
  ctaLabel: string;
}

const defaultIntroData: IntroductionData = {
  label: "Introduction",
  heading: (
    <>
      A place where pets feel
      <br />
      right at home
    </>
  ),
  description: (
    <>
      We’re dedicated to giving your pets the care they deserve,
      offering everything from health checks to grooming with
      kindness and expertise.
    </>
  ),
  ctaLabel: "Schedule a visit",
};

export default function Introduction({ data = defaultIntroData }: { data?: IntroductionData }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section ref={ref} className="relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Mobile Text (Left Side on DOM, Hidden on Desktop) */}
          <div className="max-w-[520px] h-full md:hidden flex flex-col justify-center mt-40 items-start">
            {/* Label */}
            <div className={cn(
              "mb-5 flex items-center gap-2 transition-all duration-700 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <PawIcon
                size={18}
                className="fill-[#FFC357] text-[#FFC357]"
              />
              <span className="text-[18px] text-zinc-800">
                {data.label}
              </span>
            </div>

            {/* Heading */}
            <h2 className={cn(
              "text-zinc-900 text-4xl md:text-5xl leading-tight font-medium transition-all duration-700 delay-200 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {data.heading}
            </h2>

            {/* Description */}
            <p className={cn(
              "mt-6 text-zinc-500 text-lg leading-relaxed transition-all duration-700 delay-400 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {data.description}
            </p>

            {/* CTA */}
            <Link 
              href="/services"
              className={cn(
                "mt-8 inline-block rounded-full bg-[#FFC357] px-7 py-3 text-base text-zinc-900 transition hover:opacity-90 duration-500 delay-600 ease-out transform",
                inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              {data.ctaLabel}
            </Link>
          </div>

          {/* Left Side (Image) */}
          <div className="flex justify-center">
            <div className={cn(
              "relative w-full max-w-[520px] transition-all duration-1000 ease-out transform",
              inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
            )}>
              <Image
                src="/dogwindowphoto.avif"
                alt="Happy Dog"
                width={520}
                height={650}
                className="h-auto w-full object-contain"
                priority
              />
              {/* Add glasses here later */}
            </div>
          </div>

          {/* Right Side (Desktop Text) */}
          <div className="max-w-[520px] h-full hidden md:flex flex-col justify-center md:-mt-40 items-start">
            {/* Label */}
            <div className={cn(
              "mb-5 flex items-center gap-2 transition-all duration-700 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <PawIcon
                size={18}
                className="fill-[#FFC357] text-[#FFC357]"
              />
              <span className="text-[18px] text-zinc-800">
                {data.label}
              </span>
            </div>

            {/* Heading */}
            <h2 className={cn(
              "text-zinc-900 text-4xl md:text-5xl leading-tight font-medium transition-all duration-700 delay-200 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {data.heading}
            </h2>

            {/* Description */}
            <p className={cn(
              "mt-6 text-zinc-500 text-lg leading-relaxed transition-all duration-700 delay-400 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {data.description}
            </p>

            {/* CTA */}
            <Link 
              href="/services"
              className={cn(
                "mt-8 inline-block rounded-full bg-[#FFC357] px-7 py-3 text-base text-zinc-900 transition hover:opacity-90 duration-500 delay-600 ease-out transform",
                inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              {data.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}