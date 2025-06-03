import React from "react";
import { MainLayout } from "@/components/layout";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/components/sections";

const App: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </MainLayout>
  );
};

export default App;
