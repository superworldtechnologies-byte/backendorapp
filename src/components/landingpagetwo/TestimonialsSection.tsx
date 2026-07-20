"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const defaultTestimonialData = {

  headingLine1: "Heartwarming words",
  headingLine2: "from happy pet owners",
  testimonials: [
    {
      quote:
        "The staff is very kind, and my pet always comes back happy and well-groomed. I wouldn't trust anyone else with my pet.",
      name: "Sophie Anderson",
      role: "Max's Mom",
      
    },
    {
      quote:
        "Amazing service and professional staff. They truly care about every pet that walks through the door.",
      name: "Joshua Kelsh",
      role: "Dog Walker",
      
    },
    {
      quote:
        "I've never seen my dog so excited to visit. Highly recommended for every pet owner.",
      name: "Wendy Shallum",
      role: "Dog Groomer",
      
    },
  ],
};

export default function TestimonialSection({ data = defaultTestimonialData }) {
  const [current, setCurrent] = useState(0);

  // Monitor when the testimonials section enters the viewport
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const list = data.testimonials || [];

  const next = () => {
    if (list.length === 0) return;
    setCurrent((prev) => (prev + 1) % list.length);
  };

  const prev = () => {
    if (list.length === 0) return;
    setCurrent((prev) => (prev - 1 + list.length) % list.length);
  };

  if (list.length === 0) return null;

  const testimonial = list[current];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24"
      style={{
        backgroundImage: `url(/Pkoi2k0Z35DGciBAxEX9DA0cQRo.avif)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Embedded micro-animation stylesheet to cleanly handle cross-fades on card switches */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cardContentReveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-switch {
          animation: cardContentReveal 0.5s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
        }
      `}} />

      <div className="mx-auto max-w-6xl px-4">
        {/* Header Block */}
        <div className="mb-16 flex items-center justify-center gap-8">
          <Quote className={cn(
            "h-12 w-12 text-[#002A4B] transition-all duration-1000 ease-out transform hidden sm:block",
            inView ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-12"
          )} />

          <div className="text-center">
            {data.headingLine1 && (
              <h2 className={cn(
                "text-4xl md:text-5xl font-medium text-zinc-900 transition-all duration-700 delay-700 ease-out transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                {data.headingLine1}
              </h2>
            )}
            {data.headingLine2 && (
              <h2 className={cn(
                "mt-2 text-4xl md:text-5xl font-medium text-zinc-900 transition-all duration-700 delay-200 ease-out transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                {data.headingLine2}
              </h2>
            )}
          </div>

          <Quote className={cn(
            "h-12 w-12 rotate-180 text-[#002A4B] transition-all duration-1000 ease-out transform hidden sm:block",
            inView ? "opacity-100 scale-100 rotate-180" : "opacity-0 scale-75 rotate-192"
          )} />
        </div>

        {/* Card Entry Transition */}
        <div className={cn(
          "transition-all duration-1000 delay-300 ease-out transform",
          inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
        )}>
          {/* Main Card Container */}
          <div className="mx-auto max-w-3xl rounded-[32px] bg-white/80 backdrop-blur-md p-10 md:p-14 min-h-[290px] md:min-h-[260px]">
            {/* The standard React key refreshes the DOM node on index state change, instantly re-running the animation class */}
            <div key={current} className="animate-card-switch">
              <p className="text-center text-xl md:text-2xl leading-relaxed text-zinc-800">
                "{testimonial.quote}"
              </p>

              <div className="mt-10 flex items-center justify-center gap-4">
                
                  <div className="relative h-14 w-14 overflow-hidden rounded-full">
                    <Image
                      src="/lX4cC7pSYwz3u2himuZXTpdU.avif"
                      alt={ "Testimonial profile"}
                      fill
                      className="object-cover"
                    />
                  </div>

                <div>
                  <h4 className="font-medium text-zinc-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-zinc-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Only render toggle buttons if there's more than 1 item */}
        {list.length > 1 && (
          <>
            <div className={cn(
              "mt-8 flex justify-center gap-4 transition-all duration-700 delay-500 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <button
                onClick={prev}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-zinc-100 hover:scale-105 active:scale-95"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={next}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002A4B] text-white shadow-md transition hover:opacity-90 hover:scale-105 active:scale-95"
              >
                <ChevronRight />
              </button>
            </div>

            {/* Dots */}
            <div className={cn(
              "mt-6 flex justify-center gap-2 transition-all duration-700 delay-600 ease-out",
              inView ? "opacity-100" : "opacity-0"
            )}>
              {list.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-8 bg-[#002A4B]"
                      : "w-2 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}