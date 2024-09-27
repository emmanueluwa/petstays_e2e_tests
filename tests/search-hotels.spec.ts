import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(`${UI_URL}/add-place`);

  //get the login button
  await page.getByRole("link", { name: "Login" }).click();

  //confirm "Login" text is visible - proof of being on login page
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  await page.locator("[name=email]").fill("ten@ten.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Login" }).click();

  //visuals that confirm we have logged in
  await expect(page.getByText("Login successful")).toBeVisible(); //toast
});

test("Should show place search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where to?").fill("gambia");
  await page
    .getByRole("button", {
      name: "Search",
    })
    .click();

  await expect(page.getByText("Places found in gambia")).toBeVisible();
  await expect(page.getByText("Banjul HAFH")).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where to?").fill("gambia");
  await page
    .getByRole("button", {
      name: "Search",
    })
    .click();

  await page.getByText("Banjul HAFH").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
});
