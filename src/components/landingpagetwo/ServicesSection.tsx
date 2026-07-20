'use client';

import PawIcon from "@/icons/icon1";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import {
  FaPumpSoap,
  FaBriefcaseMedical,
  FaTooth,
  FaBowlFood,
  FaBell,
} from "react-icons/fa6";

// Icon lookup dictionary to easily map string keys from JSON to Icon components
const iconMap: Record<string, IconType> = {
  soap: FaPumpSoap,
  medical: FaBriefcaseMedical,
  tooth: FaTooth,
  food: FaBowlFood,
  bell: FaBell,
};

const defaultServicesData = {
  tagline: "Services",
  heading: "Full-Service Pet Care Clinic",
  services: [
    {
      title: "Pet Grooming & Spa",
      description: "Treat your pet to a refreshing grooming experience, including gentle bathing, coat trimming, nail care, and soothing treatments.",
      iconKey: "soap",
      priceLabel: "Starting from $79"
    },
    {
      title: "Veterinary Checkups",
      description: "Support your pet's long-term health with routine exams, vaccinations, and preventive care.",
      iconKey: "medical",
      priceLabel: "Starting from $79"
    },
    {
      title: "Dental Care",
      description: "Promote your pet's oral health with thorough cleanings, plaque removal, and fresh breath.",
      iconKey: "tooth",
      priceLabel: "Starting from $79"
    },
    {
      title: "Nutritional Counseling",
      description: "Receive personalized dietary guidance tailored to your pet's needs.",
      iconKey: "food",
      priceLabel: "Starting from $79"
    },
    {
      title: "Emergency Care",
      description: "Get fast, dependable medical support when urgent health concerns arise.",
      iconKey: "bell",
      priceLabel: "Starting from $79"
    },
  ],
  ctaCard: {
    title: "Book Your Appointment",
    description: "Schedule a session with our experienced vets and groomers to give your pet the care they deserve.",
    buttonLabel: "Schedule a visit",
  }
};

export function ServicesSection({ data = defaultServicesData }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="bg-cover bg-center py-16 md:py-24 overflow-hidden"
      style={{ backgroundImage: `url('/WO8UMteyvaLuC0g01tKRUpPOU.avif')` }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div
          className={cn(
            "mb-16 text-center transition-all duration-700 ease-out transform",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <PawIcon className="h-6 w-6 text-[#FFC357]" />
            <span className="text-[17px] text-zinc-800">
              {data.tagline}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl text-zinc-800">
            {data.heading}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.services.map((service, index) => {
            // Retrieve the component from lookup map, fallback to medical icon if empty
            const Icon = iconMap[service.iconKey] || FaBriefcaseMedical;

            return (
              <div
                key={service.title}
                className={cn(
                  "rounded-[32px] bg-white p-6 transition-all duration-700 ease-out transform",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex h-10 w-10 p-2 items-center justify-center rounded-xl bg-[#D0D7F9]">
                  <Icon className="h-full w-full text-zinc-800" />
                </div>

                <h3 className="mt-6 text-[22px] text-zinc-800">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {service.description}
                </p>

                <button className="mt-8 rounded-full border border-zinc-200 px-4 py-3 text-[15px] text-zinc-800 transition-transform active:scale-95 hover:bg-zinc-50">
                  {service.priceLabel}
                </button>
              </div>
            );
          })}

          {/* CTA Card */}
          {data.ctaCard && (
            <div
              className={cn(
                "rounded-[32px] bg-[#D0D7F9] overflow-hidden p-6 flex flex-col justify-between transition-all duration-700 ease-out transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${data.services.length * 100}ms` }}
            >
              <div>
                <h3 className="text-[22px] text-zinc-800">
                  {data.ctaCard.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {data.ctaCard.description}
                </p>
              </div>

              <div className="mt-10 flex items-end justify-between">
                <button className="rounded-full bg-[#FFC357] px-5 py-3 text-sm text-zinc-800 transition-transform hover:opacity-90 active:scale-95">
                  {data.ctaCard.buttonLabel}
                </button>

                  <Image
                    src="/C0TmIz4gdVQNswbCy8C1si7JzK4.avif"
                    alt="Happy pet illustration"
                    width={120}
                    height={140}
                    className="-mb-16"
                  />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}