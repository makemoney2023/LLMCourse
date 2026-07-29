import type { Metadata } from "next";
import { ReviewSession } from "@/components/review-session";
import {
  listModules,
  loadModuleContent,
} from "@/lib/curriculum/load-curriculum";
import type { Quiz } from "@/lib/curriculum/types";

export const metadata: Metadata = {
  title: "Review",
  description:
    "Practice questions drawn from the modules you have already completed.",
};

export default function ReviewPage() {
  const modules = listModules();
  const quizzes = modules
    .map((mod) => loadModuleContent(mod.slug)?.quiz)
    .filter((quiz): quiz is Quiz => Boolean(quiz));
  const moduleTitles = Object.fromEntries(
    modules.map((mod) => [mod.id, `Module ${mod.order}: ${mod.title}`]),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">
        Review what you learned
      </h1>
      <p className="mt-2 text-muted-foreground">
        A quick mixed quiz from your completed modules. Spaced review is how
        the habits stick.
      </p>
      <div className="mt-8">
        <ReviewSession quizzes={quizzes} moduleTitles={moduleTitles} />
      </div>
    </div>
  );
}
