'use client';

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export default function ContactSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15, // Triggers when 15% of the section is visible
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    breed: "",
    dob: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section ref={ref} className="bg-white py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Left Side */}
          <div className="space-y-8">
            <h2 className={cn(
              "max-w-lg text-4xl md:text-5xl font-semibold text-zinc-800 leading-tight transition-all duration-700 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              Get in touch with our pet care experts
            </h2>

            <div className={cn(
              "overflow-hidden rounded-[40px] transition-all duration-1000 delay-150 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div
                className="relative h-[500px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/zma9pqp6_expires_30_days.png')",
                }}
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between rounded-full bg-white p-3 shadow-lg">
                    <p className="max-w-xs text-sm text-zinc-500">
                      Your pet's comfort, health, and happiness.
                    </p>

                    <img
                      src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8iVEHnhHH/npdhln9l_expires_30_days.png"
                      alt="Pet"
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className={cn(
              "text-zinc-600 transition-all duration-700 delay-300 ease-out transform",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Exceptional care and wellness services designed to keep pets thriving.
            </p>
          </div>

          {/* Right Side - Interactive Card Reveal */}
          <div className={cn(
            "rounded-[32px] bg-[#FFEEF5] p-8 md:p-10 transition-all duration-1000 delay-200 ease-out transform",
            inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
          )}>
            <h3 className="mb-8 text-3xl font-semibold text-zinc-800">
              Send us a message
            </h3>

            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Services
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-yellow-500"
                  >
                    <option value="">Select a service</option>
                    <option>Pet Grooming</option>
                    <option>Veterinary Care</option>
                    <option>Pet Boarding</option>
                    <option>Training</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Type & Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={form.breed}
                    onChange={handleChange}
                    placeholder="Enter your pet's breed"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your pet..."
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-yellow-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#FFC357] py-4 font-medium text-zinc-900 transition hover:opacity-90 transform active:scale-[0.99] duration-200"
              >
                Submit
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}