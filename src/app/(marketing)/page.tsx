import { HeroSection } from "@/components/marketing/HeroSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { HowToUseSection } from "@/components/marketing/HowToUseSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { VaultPreviewSection } from "@/components/marketing/VaultPreviewSection";
import { PrivacySection } from "@/components/marketing/PrivacySection";
import { InstallSection } from "@/components/marketing/InstallSection";

export default function MarketingHomePage() {
  return (
    <div className="w-full">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Problem strip + dark section */}
      <ProblemSection />

      {/* 3. How it works (4 steps) */}
      <HowItWorksSection />

      {/* 4. HOW TO USE (5 steps with sample spoken quotes + tip box) */}
      <HowToUseSection />

      {/* 5. Features grid (6 cards) */}
      <FeaturesSection />

      {/* 6. Vault preview (library illustration) */}
      <VaultPreviewSection />

      {/* 7. Privacy (honest terms, Groq disclosure) */}
      <PrivacySection />

      {/* 8. INSTALL / DOWNLOAD (Smart PWA button + exact tabs) */}
      <InstallSection />
    </div>
  );
}

