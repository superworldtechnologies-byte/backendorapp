import PetIcon from '@/icons/PetIcon';
import Bath from '@/icons/Bath';
import Scissors from '@/icons/Scissors';
import ScissorsLineDashed from '@/icons/ScissorsLineDashed';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal'; // Import the client wrapper

const defaultServicesData = {
    heading: "Services we provide",
    description: "Our awesome team treats your pets like family, whether it's a quick bath or a full-on grooming and style session.",
    services: [
        {
            title: 'Full body grooming',
            description: 'Complete pampering from head to tail—bath, dry, trim, and style all taken care of.',
            icon: PetIcon,
        },
        {
            title: 'Bath & blow dry',
            description: 'Deep cleansing bath premium a professional blow dry finish included.',
            icon: Bath,
        },
        {
            title: 'Haircut & styling',
            description: "Custom cuts and fun styles that totally match your pet's unique vibe perfectly.",
            icon: Scissors,
        },
        {
            title: 'Nail trimming',
            description: 'Safe and precise nail clipping to keep your pet comfortable and healthy always.',
            icon: ScissorsLineDashed,
        },
    ],
    cta: {
        label: "View More Services"
    }
};

export default function ServicesSection({ data = defaultServicesData }) {
    // Array of standard Tailwind delays to map over the cards
    const cardDelays = ["delay-0", "delay-150", "delay-300", "delay-500"];

    return (
        <section className="bg-[#fffaf8] py-20 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6  flex flex-col items-center">

                {/* Section Header (Slides Down) */}
                <Reveal animation="down" className="flex flex-col items-center text-center max-w-[560px] mb-12 lg:mb-[72px]">
                    <h2 className="text-[#1e0c05] font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4">
                        {data.heading}
                    </h2>
                    <p className="text-[#625b5b] text-base md:text-[18px] leading-[1.6]">
                        {data.description}
                    </p>
                </Reveal>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
                    {data.services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            /* Each card scales up with a staggered delay */
                            <Reveal key={index} animation="scale" delay={cardDelays[index] || "delay-700"} className="h-full">
                                <div className="group flex flex-col h-full bg-[#faf3ec] border border-[#ece5de] rounded-2xl p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    
                                    {/* Icon */}
                                    <div className="mb-[37px]">
                                        <Icon className="w-11 h-11 text-[#1e0c05] stroke-[1.5]" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow justify-between gap-[30px]">
                                        <div>
                                            <h3 className="text-[#1e0c05] font-medium text-[20px] leading-[1.2] tracking-[-0.5px] mb-[10px]">
                                                {service.title}
                                            </h3>
                                            <p className="text-[#625b5b] text-[14px] leading-[1.48]">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Learn More Link */}
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-2 text-[#1e0c05] font-medium text-[16px] group-hover:text-[#a35c38] transition-colors"
                                        >
                                            Learn More
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                {/* View More Button (Slides up) */}
                <Reveal animation="up" delay="delay-200">
                    <button className="group relative bg-[#a35c38] text-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2.5 w-fit overflow-hidden hover:bg-[#8a4e2f] transition-all duration-300">
                        <span className="font-medium text-[16px] whitespace-nowrap">
                            {data.cta.label}
                        </span>
                        <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-45deg] group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                    </button>
                </Reveal>

            </div>
        </section>
    );
}