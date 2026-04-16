import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads successfully and renders the main content", async ({ page }) => {
    await page.goto("/");

    // The page must return a 200 (no crash on load)
    const response = await page.request.get("/");
    expect(response.status()).toBe(200);

    // The document title must be present
    await expect(page).toHaveTitle(/.+/);

    // The <main> landmark must be in the DOM
    await expect(page.locator("main")).toBeVisible();
  });
});
