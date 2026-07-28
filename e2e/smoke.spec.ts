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
  await termLink.hover();
  await expect(page.getByRole("tooltip")).toBeVisible();
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
