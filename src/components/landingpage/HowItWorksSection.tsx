'use client';

import PawIcon from "@/icons/icon1";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: <MapPin className=" h-7 w-7 bg-[#FFC357] p-1.5 rounded-full text-white " />,
    title: "Book Your Appointment",
    description:
      "Pick a date and time that fits your schedule, and secure a session for your pet’s grooming or wellness visit.",
    delay: "delay-100"
  },
  {
    icon: <MapPin className=" h-7 w-7 bg-[#FFC357] p-1.5 rounded-full text-white " />,
    title: "Stop by Our Clinic",
    description:
      "Visit with your pet and let our experienced team provide gentle, professional treatment.",
    delay: "delay-300"
  },
  {
    icon: <MapPin className=" h-7 w-7 bg-[#FFC357] p-1.5 rounded-full text-white " />,
    title: "Leave With a Happy Pet",
    description:
      "After their visit, your pet heads home feeling refreshed, healthier, and full of joy. Whether it’s a cleaner coat or improved wellness.",
    delay: "delay-500"
  },
];

export default function HowItWorksSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section ref={ref} className="bg-gradient-to-b from-zinc-100 to-white py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          
          {/* Left Side (Text & Image) */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              {/* Sub-label */}
              <div className={cn(
                "flex items-center gap-2 transition-all duration-700 ease-out transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <PawIcon className="h-6 w-6 text-[#FFC357]" />
                <span className="text-[17px] text-zinc-800">
                  How it works
                </span>
              </div>

              {/* Heading */}
              <h2 className={cn(
                "max-w-[500px] text-3xl leading-tight text-zinc-800 md:text-4xl lg:text-[44px] lg:leading-[1.15] transition-all duration-700 delay-100 ease-out transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}>
                Straightforward steps to give your pet the best care
              </h2>
            </div>

            {/* Left Image Showcase */}
            <div className={cn(
              "overflow-hidden rounded-3xl transition-all duration-1000 delay-200 ease-out transform",
              inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.99]"
            )}>
              <Image
                src="/6OP0cfLbFDebaOcYg0wyASwZY.avif"
                alt="How it works"
                width={602}
                height={396}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side (Staggered Step Cards) */}
          <div className="flex flex-col gap-6">
            {steps.map((step) => (
              <div
                key={step.title}
                className={cn(
                  "rounded-2xl bg-white p-6 shadow-sm transition-all duration-700 ease-out transform",
                  inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]",
                  step.delay
                )}
              >
                {step.icon}

                <h3 className="mb-4 text-[22px] text-zinc-800 mt-4">
                  {step.title}
                </h3>

                <p className="max-w-[320px] text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}