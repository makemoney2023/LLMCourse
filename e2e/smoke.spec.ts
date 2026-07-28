import { expect, type Page, test } from "@playwright/test";

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

async function submitQuiz(page: Page) {
  const radios = page.locator('input[type="radio"]');
  await expect(radios.first()).toBeVisible();
  const names = await radios.evaluateAll((nodes) => [
    ...new Set(nodes.map((n) => (n as HTMLInputElement).name)),
  ]);
  for (const name of names) {
    await page.locator(`input[type="radio"][name="${name}"]`).first().check();
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
  await page.getByRole("link", { name: /Talk to us/i }).first().click();
  await expect(page.locator("#contact")).toBeVisible();
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

test("quiz stays locked until steps and exercises; then unlocks next module", async ({
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
  await expect(page.getByRole("button", { name: "Submit quiz" })).toBeVisible();

  await submitQuiz(page);
  await expect(
    page.getByRole("link", { name: /View certificate/i }),
  ).toBeVisible();
  await expect(page.getByText(/Module complete · quiz/i)).toBeVisible();

  await page.goto("/modules/deep-research");
  await expect(
    page.getByRole("heading", { level: 1, name: "Deep research", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/This module is locked/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Mark step done" }).first(),
  ).toBeVisible();
});

test("module 2 stays locked until module 1 quiz is done", async ({ page }) => {
  await page.goto("/modules/deep-research");
  await expect(page.getByText(/This module is locked/i)).toBeVisible();
  await expect(
    page
      .getByRole("article")
      .getByText(/Finish Module 1: Mental model first/i),
  ).toBeVisible();
});
