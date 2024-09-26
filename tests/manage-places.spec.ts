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

test("should allow user to add a place", async ({ page }) => {
  await page.goto(`${UI_URL}/add-place`);

  await page.locator('[name="name"]').fill("Test Place");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("Test testing the description section for the test place");
  await page.locator('[name="pricePerNight"]').fill("89");
  await page.locator('[name="pricePerNight"]').fill("89");

  await page.selectOption('select[name="starRating"]', "4");
  await page.getByText("Penthouse").click();
  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("6");

  await page.setInputFiles("[name='imageFiles']", [
    path.join(__dirname, "files", "ein.jpg"),
    path.join(__dirname, "files", "zwei.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Place saved")).toBeVisible();
});

test("should display places", async ({ page }) => {
  await page.goto(`${UI_URL}/my-places`);

  await expect(page.getByText("Banjul HAFH")).toBeVisible();
  await expect(page.getByText("Just texting")).toBeVisible();
  await expect(page.getByText("Banjul, Gambia")).toBeVisible();
  await expect(page.getByText("Penthouse").first()).toBeVisible();
  await expect(page.getByText("£90 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 8 children")).toBeVisible();
  await expect(page.getByText("5 Star rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Place" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-places`);

  await page.getByRole("link", { name: "View details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue(
    "Banjul HAFH CHANGED"
  );
  await page.locator('[name="name"]').fill("Banjul HAFH");

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Place saved")).toBeVisible();

  await page.reload();

  //reset back to original for future test
  await expect(page.locator('[name="name"]')).toHaveValue("Banjul HAFH");
  await page.locator('[name="name"]').fill("Banjul HAFH CHANGED");
  await page.getByRole("button", { name: "Save" }).click();
});
