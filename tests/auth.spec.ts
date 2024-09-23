import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test("should allow the user to login", async ({ page }) => {
  await page.goto(UI_URL);

  //get the login button
  await page.getByRole("link", { name: "Login" }).click();

  //confirm "Login" text is visible - proof of being on login page
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  await page.locator("[name=email]").fill("ten@ten.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Login" }).click();

  //visuals that confirm we have logged in
  await expect(page.getByText("Login successful")).toBeVisible(); //toast
  //headers
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Places" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});

test("should allow user to register", async ({ page }) => {
  //ensure new email each test
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@reg.com`;

  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();

  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("e2e_first");
  await page.locator("[name=lastName]").fill("e2e_last");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password1");
  await page.locator("[name=confirmPassword]").fill("password1");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Successful registration")).toBeVisible(); //toast
  //headers
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Places" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});
