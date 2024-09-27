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

test("should book place", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where to?").fill("gambia");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page
    .getByRole("button", {
      name: "Search",
    })
    .click();

  await page.getByText("Banjul HAFH").click();
  await page.getByRole("button", { name: "Book Now" }).click();

  await expect(page.getByText("Total Cost: £270.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("34587");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking complete")).toBeVisible();
});

test("should view my bookings", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where to?").fill("gambia");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page
    .getByRole("button", {
      name: "Search",
    })
    .click();

  await page.getByText("Banjul HAFH").click();
  await page.getByRole("button", { name: "Book Now" }).click();

  await expect(page.getByText("Total Cost: £270.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("34587");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking complete")).toBeVisible();

  await page.getByRole("link", { name: "My Bookings" }).click();
  await expect(page.getByText("Banjul HAFH")).toBeVisible();
});
