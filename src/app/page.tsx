import { HomeContact } from "@/components/marketing/home-contact";
import { HomeFooter } from "@/components/marketing/home-footer";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeHowItWorks } from "@/components/marketing/home-how-it-works";
import { HomeIncluded } from "@/components/marketing/home-included";
import { HomeOutcomes } from "@/components/marketing/home-outcomes";
import { HomeProblem } from "@/components/marketing/home-problem";
import { HomeProof } from "@/components/marketing/home-proof";
import { HomeResumeBanner } from "@/components/marketing/home-resume-banner";
import { HomeRollout } from "@/components/marketing/home-rollout";
import {
  listModuleExerciseIds,
  listModules,
} from "@/lib/curriculum/load-curriculum";

export default function HomePage() {
  const modules = listModules();
  const exerciseIdsByModule = listModuleExerciseIds();

  return (
    <div className="flex flex-col">
      <HomeResumeBanner
        modules={modules}
        exerciseIdsByModule={exerciseIdsByModule}
      />
      <HomeHero />
      <HomeProblem />
      <HomeOutcomes />
      <HomeProof />
      <HomeIncluded />
      <HomeHowItWorks />
      <HomeRollout />
      <HomeContact />
      <HomeFooter />
    </div>
  );
}
