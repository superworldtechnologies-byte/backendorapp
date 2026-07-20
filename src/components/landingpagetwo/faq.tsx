'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import PawIcon from "@/icons/icon1";

// TypeScript Interfaces for strict and clean data typing
interface FAQItemData {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionData {
 
  headingLine1: string;
  headingLine2: string;
  items: FAQItemData[];
}


interface FAQItemProps {
  faq: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
}
const defaultFAQData: FAQSectionData = {

  headingLine1: "Support & Guidance for Your",
  headingLine2: "Pet's Needs",
  items: [
    {
      id: 1,
      question: "How often should my pet get a wellness checkup?",
      answer:
        "It's recommended that most pets receive a wellness checkup at least once a year. Regular visits help us catch potential issues early, keep vaccinations up to date, and ensure your pet stays healthy and comfortable.",
    },
    {
      id: 2,
      question: "What services do you offer for pets?",
      answer:
        "We offer veterinary care, grooming, wellness exams, vaccinations, boarding, and preventative healthcare services.",
    },
    {
      id: 3,
      question: "Do I need an appointment before visiting the clinic?",
      answer:
        "Appointments are recommended to reduce waiting time, but we also accommodate walk-ins when possible.",
    },
    {
      id: 4,
      question: "Do you provide grooming for all pet sizes and breeds?",
      answer:
        "Yes, our grooming team is trained to handle pets of all breeds, sizes, and coat types.",
    },
    {
      id: 5,
      question: "What should I bring for my pet's first visit?",
      answer:
        "Please bring vaccination records, medical history, medications, and any relevant information about your pet.",
    },
  ],
};

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border transition-all duration-300",
        isOpen
          ? "bg-white border-zinc-200 shadow-sm"
          : "bg-[#E7EBFC] border-transparent"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-6 p-6 text-left"
      >
        <span className="text-2xl font-semibold text-zinc-900">
          {String(faq.id).padStart(2, "0")}
        </span>

        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-medium text-zinc-900">
            {faq.question}
          </h3>
        </div>

        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-zinc-700" />
        ) : (
          <ChevronDown className="h-6 w-6 text-zinc-700" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        )}
      >
        <div className="px-6 sm:px-20 text-zinc-500 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection({ data = defaultFAQData }: { data?: FAQSectionData }) {
  // Sets the first dynamic item as active by default if items exist
  const [active, setActive] = useState<number | null>(data.items?.[0]?.id ?? null);

  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { ref: listRef, inView: listInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const toggleFAQ = (id: number) => {
    setActive(active === id ? null : id);
  };

  const delays = ["delay-[0ms]", "delay-[100ms]", "delay-[200ms]", "delay-[300ms]", "delay-[400ms]"];

  return (
    <section
      className="py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,#FFFFFF 0%,#FFEEF5 50%,#FFFFFF 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl px-4">
        
        {/* Header Block */}
        <div ref={headerRef} className="mb-16 text-center">
          {/* Sub-label Badge */}
          
            <div className={cn(
              "mb-4 flex items-center justify-center gap-2 transition-all duration-700 ease-out transform",
              headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}>
            <PawIcon></PawIcon>
              <span className="text-lg text-zinc-800">FAQ</span>
            </div>

          {/* Heading Line 1 */}
          <h2 className={cn(
            "text-4xl md:text-5xl font-semibold text-zinc-900 transition-all duration-700 delay-100 ease-out transform",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {data.headingLine1}
          </h2>

          {/* Heading Line 2 */}
          <h2 className={cn(
            "mt-2 text-4xl md:text-5xl font-semibold text-zinc-900 transition-all duration-700 delay-200 ease-out transform",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {data.headingLine2}
          </h2>
        </div>

        {/* Accordion / Card Wrapper */}
        <div ref={listRef} className="space-y-3">
          {data.items?.map((faq, index) => (
            <div
              key={faq.id}
              className={cn(
                "transition-all duration-700 ease-out transform",
                listInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.99]",
                delays[index] || "delay-[0ms]"
              )}
            >
              <FAQItem
                faq={faq}
                isOpen={active === faq.id}
                onToggle={() => toggleFAQ(faq.id)}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}