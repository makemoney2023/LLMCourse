import { expect, test } from "@playwright/test";

test("home → module → complete exercise path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "LLM Leverage" })).toBeVisible();
  await page.getByRole("link", { name: "Start Module 1" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Mental model", exact: true }),
  ).toBeVisible();

  const doneCheckbox = page.getByLabel(/Mark .* complete/i).first();
  await doneCheckbox.check();
  await expect(doneCheckbox).toBeChecked();

  await page.getByRole("button", { name: "Reveal answer key" }).first().click();
  await expect(page.getByText("Answer key").first()).toBeVisible();

  await page.getByRole("button", { name: "Mark module complete" }).click();
  await expect(
    page.getByRole("button", { name: "Module marked complete" }),
  ).toBeVisible();
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
    page.getByTestId("glossary-sheet").getByRole("link", { name: /Open full glossary/i }),
  ).toBeVisible();
});

test("resources hub and try-it sandbox", async ({ page }) => {
  await page.goto("/resources");
  await expect(page.getByRole("heading", { name: "Resources" })).toBeVisible();
  await page.getByRole("link", { name: /Write a grounded wall rule/i }).click();
  await expect(page.getByRole("heading", { name: /grounded wall rule/i })).toBeVisible();
  await page.getByPlaceholder(/Write your answer/i).fill("Prefer BRIEF.md. Never invent prices. Ask if missing.");
  await page.getByRole("button", { name: /Compare to model answer/i }).click();
  await expect(page.getByRole("heading", { name: "Model answer" })).toBeVisible();
});

test("capstone gallery loads", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: "Capstone gallery" })).toBeVisible();
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
});
