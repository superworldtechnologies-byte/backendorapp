import AboutSection from "@/components/landingpage/AboutSection";
import ContactSection from "@/components/landingpage/ContactSection";
import FAQSection from "@/components/landingpage/faq";
import GallerySection from "@/components/landingpage/Gallary";
import HeroSection from "@/components/landingpage/home";
import HowItWorksSection from "@/components/landingpage/HowItWorksSection";
import Introduction from "@/components/landingpage/Introduction";
import { ServicesSection } from "@/components/landingpage/ServicesSection";
import TestimonialsSection from "@/components/landingpage/TestimonialsSection";
import WhyChooseUs from "@/components/landingpage/WhyChooseUs";
import WhyUsSection from "@/components/landingpage/WhyUsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Introduction></Introduction>
      <WhyChooseUs></WhyChooseUs>
      <WhyUsSection></WhyUsSection>
      <ServicesSection></ServicesSection>
      <AboutSection></AboutSection>
      <HowItWorksSection></HowItWorksSection>
      <TestimonialsSection></TestimonialsSection>
      <GallerySection></GallerySection>
      <FAQSection></FAQSection>
      <ContactSection></ContactSection>
     
    </main>

  );
}
