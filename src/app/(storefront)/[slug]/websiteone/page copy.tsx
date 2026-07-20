import AboutSection from "@/components/landingpageone/AboutSection";
import ComparisonSection from "@/components/landingpageone/ComparisonSection";
import CTASection from "@/components/landingpageone/CTASection";
import Footer from "@/components/landingpageone/footer";
import GallerySection from "@/components/landingpageone/GallerySection";
import Homepage from "@/components/landingpageone/Home";
import InsightsSection from "@/components/landingpageone/InsightsSection";
import Navbar from "@/components/landingpageone/Navbar";
import ProcessSection from "@/components/landingpageone/ProcessSection";
import StatsBanner from "@/components/landingpageone/ReviewSection";
import ReviewsSection from "@/components/landingpageone/ReviewsSection";
import ServicesSection from "@/components/landingpageone/ServicesSection";

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <Homepage></Homepage>
      <StatsBanner></StatsBanner>
      <AboutSection></AboutSection>
      <ServicesSection></ServicesSection>
      <ProcessSection></ProcessSection>
      <ComparisonSection></ComparisonSection>
      <GallerySection></GallerySection>
      <ReviewsSection></ReviewsSection>
      <InsightsSection></InsightsSection>
      <CTASection></CTASection>
      <Footer></Footer>
    </>
  );
}
