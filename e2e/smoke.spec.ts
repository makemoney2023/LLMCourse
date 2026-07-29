import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";
import { parse as parseYaml } from "yaml";

async function completeLessonSteps(page: Page) {
  for (let i = 0; i < 3; i++) {
    const mark = page.getByRole("button", { name: "Mark step done" });
    await expect(mark.first()).toBeVisible();
    await mark.first().click();
  }
}

async function completeAllExercises(page: Page) {
  const boxes = page.getByLabel(/Mark .* complete/i);
  const count = await boxes.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const box = boxes.nth(i);
    await box.scrollIntoViewIfNeeded();
    await box.click({ force: true });
  }
  // Completing the last exercise advances focus to the quiz automatically.
  await expect(
    page.getByRole("heading", { name: "Check for understanding" }),
  ).toBeVisible({ timeout: 10_000 });
}

function loadCorrectAnswers(moduleDir: string): Record<string, string> {
  const raw = readFileSync(
    join(process.cwd(), "curriculum", "modules", moduleDir, "quiz.yaml"),
    "utf8",
  );
  const quiz = parseYaml(raw) as {
    questions: { id: string; correctOptionId: string }[];
  };
  return Object.fromEntries(
    quiz.questions.map((q) => [q.id, q.correctOptionId]),
  );
}

async function submitQuizWithAnswers(
  page: Page,
  answers: Record<string, string>,
) {
  for (const [questionId, optionId] of Object.entries(answers)) {
    await page
      .locator(`input[type="radio"][name="${questionId}"][value="${optionId}"]`)
      .check();
  }
  await page.getByRole("button", { name: "Submit quiz" }).click();
}

test("home marketing CTAs and learner entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "LLM Leverage" }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Train teams to get reliable AI output/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Preview the course/i })).toBeVisible();
  await page.getByRole("link", { name: /Plan a team rollout/i }).click();
  await expect(page.locator("#rollout")).toBeVisible();
  await page.getByRole("link", { name: /^Contact$/i }).first().click();
  await expect(page.locator("#contact")).toBeVisible();
  // Without NEXT_PUBLIC_CONTACT_EMAIL baked into the build, the contact CTA
  // renders as a disabled button with a setup hint instead of a mailto link.
  await expect(
    page.getByText(/Email us about a rollout/i).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: /Preview the course/i }).first().click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Mental model", exact: true }),
  ).toBeVisible();
});

test("module → steps → practice path", async ({ page }) => {
  await page.goto("/modules/mental-model");
  await expect(
    page.getByRole("heading", { level: 1, name: "Mental model", exact: true }),
  ).toBeVisible();

  await completeLessonSteps(page);
  await expect(page.getByRole("heading", { name: "Practice" })).toBeVisible();
  const doneCheckbox = page.getByLabel(/Mark .* complete/i).first();
  await doneCheckbox.check();
  await expect(doneCheckbox).toBeChecked();

  await page.getByRole("button", { name: "Reveal answer key" }).first().click();
  await expect(page.getByText("Answer key").first()).toBeVisible();

  // Deep-link back to an earlier, already-unlocked step via #step-* hash.
  // Navigate away first: Continue links always arrive from another page.
  await page.goto("/modules");
  await page.goto("/modules/mental-model#step-orient");
  await expect(page.getByRole("heading", { name: "Get oriented" })).toBeVisible();
});

test("glossary page lists terms and hash targets", async ({ page }) => {
  await page.goto("/glossary");
  await expect(
    page.getByRole("heading", { level: 1, name: "Glossary" }),
  ).toBeVisible();
  await expect(page.locator("#context-window")).toBeVisible();
  await page.goto("/modules/mental-model");
  const termLink = page.locator("a.glossary-term").first();
  await expect(termLink).toBeVisible();
  await expect(termLink).toHaveAttribute("href", /\/glossary#/);
  await termLink.dispatchEvent("click");
  await expect(page.getByTestId("glossary-sheet")).toBeVisible();
  await expect(
    page
      .getByTestId("glossary-sheet")
      .getByRole("link", { name: /Open full glossary/i }),
  ).toBeVisible();
});

test("resources hub and try-it sandbox", async ({ page }) => {
  await page.goto("/resources");
  await expect(page.getByRole("heading", { name: "Resources" })).toBeVisible();
  await page.getByRole("link", { name: /Write a grounded wall rule/i }).click();
  await expect(
    page.getByRole("heading", { name: /grounded wall rule/i }),
  ).toBeVisible();
  await page
    .getByPlaceholder(/Write your answer/i)
    .fill("Prefer BRIEF.md. Never invent prices. Ask if missing.");
  await page.getByRole("button", { name: /Compare to model answer/i }).click();
  await expect(page.getByRole("heading", { name: "Model answer" })).toBeVisible();
});

test("capstone gallery loads", async ({ page }) => {
  await page.goto("/gallery");
  await expect(
    page.getByRole("heading", { name: "Capstone gallery" }),
  ).toBeVisible();
  await expect(page.getByText(/First-call prep notes/i)).toBeVisible();
});

test("workshops index links to slide deck and modules", async ({ page }) => {
  await page.goto("/workshops");
  await page
    .getByRole("link")
    .filter({ hasText: /research pack|wall rules|Session 1/i })
    .first()
    .click();
  await expect(page.getByText(/Slide 1/i)).toBeVisible();
  await page.getByRole("button", { name: "Next slide" }).click();
  await expect(page.getByText(/Slide 2/i)).toBeVisible();
  await expect(page.getByText(/Linked self-paced modules/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Module 1: Mental model/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Try-it sandbox/i }).first(),
  ).toBeVisible();
});

test("quiz gates on steps and exercises; passing completes the module", async ({
  page,
}) => {
  await page.goto("/modules/mental-model");
  await expect(
    page.getByRole("heading", { name: "Get oriented" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark step done" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Practice" })).toHaveCount(0);

  await completeLessonSteps(page);
  await expect(page.getByRole("heading", { name: "Practice" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue to quiz" }),
  ).toBeDisabled();

  await completeAllExercises(page);

  await expect(
    page.getByRole("heading", { name: "Check for understanding" }),
  ).toBeVisible();
  await expect(page.getByText(/Need 75% to complete/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit quiz" })).toBeVisible();

  const answers = loadCorrectAnswers("01-mental-model");

  // Failing attempt: answer "a" everywhere. Correct ids are distributed
  // across a–d, so this scores below the 75% pass threshold.
  const allA = Object.fromEntries(
    Object.keys(answers).map((questionId) => [questionId, "a"]),
  );
  await submitQuizWithAnswers(page, allA);
  await expect(page.getByText(/need 75% to complete/i).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /View certificate/i }),
  ).toHaveCount(0);

  // Passing retry with the real answer key.
  await page.getByRole("button", { name: "Retry" }).click();
  await submitQuizWithAnswers(page, answers);
  await expect(page.getByText(/module complete/i).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /View certificate/i }),
  ).toBeVisible();
  await expect(page.getByText(/Module complete · quiz/i)).toBeVisible();

  await page.getByRole("link", { name: /View certificate/i }).click();
  await expect(page).toHaveURL(/\/certificates\/module-mental-model$/);
  await expect(
    page.getByRole("heading", { name: /Module certificate — Mental model/i }),
  ).toBeVisible();
  await expect(page.getByText(/This certificate is locked/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Print/i })).toBeVisible();

  await page.goto("/modules/deep-research");
  await expect(
    page.getByRole("heading", { level: 1, name: "Deep research", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Jumping ahead/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Mark step done" }).first(),
  ).toBeVisible();

  // The marketing home now greets returning learners with progress.
  await page.goto("/");
  await expect(page.getByText(/Welcome back/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Continue where you left off/i }),
  ).toBeVisible();
});

test("flashcards flip and track known cards", async ({ page }) => {
  await page.goto("/flashcards");
  await expect(page.getByRole("heading", { name: "Flashcards" })).toBeVisible();
  await expect(page.getByText(/0 of \d+ known/)).toBeVisible();
  await page.getByText(/Term — select to reveal/i).click();
  await expect(page.getByText(/^Definition$/)).toBeVisible();
  await page.getByRole("button", { name: "Got it" }).click();
  await expect(page.getByText(/1 of \d+ known/)).toBeVisible();
});

test("capstone builder seeds templates and persists edits", async ({
  page,
}) => {
  await page.goto("/capstone");
  await expect(
    page.getByRole("heading", { name: /Capstone pack builder/i }),
  ).toBeVisible();

  // Scope form (Exercise 1 as fields).
  await page
    .getByLabel(/Workflow you own/i)
    .fill("Weekly manager status");

  // BRIEF.md is open by default and seeded from the template.
  const brief = page.getByLabel("BRIEF.md contents");
  await expect(brief).toHaveValue(/# Project brief/);
  await brief.fill("# BRIEF\n\nMy capstone project.");

  // Collapsed pack files open on demand.
  await page.getByText(/VERIFY\.md — the pre-ship checklist/i).click();
  await expect(page.getByLabel("VERIFY.md contents")).toHaveValue(
    /# Verify checklist/,
  );

  // Readiness checklist persists.
  await page
    .getByRole("checkbox", { name: /All eight pack files exist/i })
    .click();

  // Story sharing stays gated until the arc is filled in.
  const copyButton = page.getByRole("button", { name: "Copy story" });
  await expect(copyButton).toBeDisabled();
  await page.getByLabel(/Before — the old habit/i).fill("45 min of copy-paste");
  await page.getByLabel(/After — this run/i).fill("18 min, zero errors");
  await page
    .getByLabel(/The default you are keeping/i)
    .fill("Always attach BRIEF.md");
  await expect(copyButton).toBeEnabled();

  // Everything survives a reload.
  await page.goto("/resources");
  await page.goto("/capstone");
  await expect(page.getByLabel("BRIEF.md contents")).toHaveValue(
    "# BRIEF\n\nMy capstone project.",
  );
  await expect(page.getByLabel(/Workflow you own/i)).toHaveValue(
    "Weekly manager status",
  );
  await expect(
    page.getByRole("checkbox", { name: /All eight pack files exist/i }),
  ).toBeChecked();
});

test("review page shows empty state before any module is complete", async ({
  page,
}) => {
  await page.goto("/review");
  await expect(
    page.getByRole("heading", { name: /Review what you learned/i }),
  ).toBeVisible();
  await expect(page.getByText(/Nothing to review yet/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Go to modules/i })).toBeVisible();
});

test("command palette opens and navigates", async ({ page }) => {
  await page.goto("/modules");
  await page.getByRole("button", { name: /Search the course/i }).click();
  const input = page.getByPlaceholder(/Search modules, terms, pages/i);
  await expect(input).toBeVisible();
  await input.fill("Deep research");
  await page.getByRole("option", { name: /Deep research/i }).first().click();
  await expect(page).toHaveURL(/\/modules\/deep-research/);
});

test("jumping ahead shows the recommended-path banner", async ({ page }) => {
  await page.goto("/modules/deep-research");
  await expect(
    page.getByRole("heading", { level: 1, name: "Deep research", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Jumping ahead/i)).toBeVisible();
  await expect(
    page.getByText(/Recommended after Module 1: Mental model/i),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Back to recommended path/i }),
  ).toBeVisible();
  // The module is still fully usable while jumping ahead.
  await expect(
    page.getByRole("button", { name: "Mark step done" }).first(),
  ).toBeVisible();
});
