'use client';

import PawIcon from "@/icons/icon1";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import {
  FaHeartPulse,
  FaPumpSoap,
  FaCarrot,
  FaPaw,
  FaPhone,
  FaTooth,
} from "react-icons/fa6";

const features = [
  {
    icon: FaHeartPulse,
    title: "Tailored Wellness Plans",
    description:
      "Comprehensive checkups, vaccinations, and preventive care designed to keep your pet healthy, active, and thriving year-round.",
  },
  {
    icon: FaPumpSoap,
    title: "Professional Grooming",
    description:
      "Expert grooming, bathing, and coat care that leaves your pet looking clean, feeling comfortable, and smelling fresh every single time.",
  },
  {
    icon: FaCarrot,
    title: "Nutritional Guidance",
    description:
      "Customized meal plans and expert nutrition advice to support your pet's overall health, energy, and long-term wellness.",
  },
  {
    icon: FaPaw,
    title: "Emergency Care",
    description:
      "Fast, reliable medical attention when your pet needs urgent support, ensuring quick assessment and prompt treatment.",
  },
  {
    icon: FaPhone,
    title: "Behavioral Support",
    description:
      "Personalized training and behavior consultations that help your pet feel confident, well-behaved, and emotionally balanced.",
  },
  {
    icon: FaTooth,
    title: "Dental Health",
    description:
      "Thorough dental cleanings and oral care services to maintain strong teeth, healthy gums, and fresh breath.",
  },
];

export default function WhyUsSection() {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { ref: gridRef, inView: gridInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Heading Section */}
        <div ref={headerRef} className="mb-16 text-center">
          {/* Sub-label */}
          <div className={cn(
            "mb-4 flex items-center justify-center gap-2 transition-all duration-700 ease-out transform",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}>
            <PawIcon size={18} className="fill-[#FFC357] text-[#FFC357]" />
            <span className="text-[17px] text-zinc-800">
              Why us
            </span>
          </div>

          {/* Title */}
          <h2 className={cn(
            "mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl leading-tight text-zinc-800 transition-all duration-700 delay-100 ease-out transform",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Compassion and quality in
            <br className="hidden sm:block" />
            every moment of care
          </h2>
        </div>

        {/* Cards Grid */}
        <div ref={gridRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "relative overflow-hidden rounded-[32px] min-h-[360px] transition-all duration-700 ease-out transform"
              )}
              style={{
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${index * 100}ms` // Perfect cascade sequence regardless of column count
              }}
            >
              <Image
                src="/irH7Dag30YqNcSK7sjeAhwh3P8.avif"
                alt="Feature illustration"
                fill
                className="  absolute "
              />
              <div className="relative z-10 flex h-full flex-col p-6 justify-center ">
                <feature.icon className="h-9 w-9 text-zinc-900" />

                <h3 className="mt-6 text-[22px] text-zinc-800">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}