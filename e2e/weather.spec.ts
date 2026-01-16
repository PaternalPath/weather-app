import { test, expect } from '@playwright/test';

// Increase default timeout for CI
test.setTimeout(60000);

test.describe('Weather Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.getByRole('heading', { name: 'Weather Dashboard' })).toBeVisible();

    // Check search input is present
    await expect(page.getByPlaceholder('Search for a city...')).toBeVisible();

    // Check temperature unit toggle is present
    await expect(page.getByRole('button', { name: 'Celsius' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fahrenheit' })).toBeVisible();
  });

  test('search for a location and display weather', async ({ page }) => {
    await page.goto('/');

    // Type in search box
    const searchInput = page.getByPlaceholder('Search for a city...');
    await searchInput.fill('London');

    // Wait for search results (longer timeout for CI)
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 15000 });

    // Click on first result
    const firstResult = page.getByRole('option').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    // Wait for weather data to load (longer timeout for CI)
    await expect(page.getByText(/°/)).toBeVisible({ timeout: 15000 });

    // Verify current weather card is displayed
    await expect(page.locator('text=London').first()).toBeVisible();
  });

  test('search input has clear button when text is entered', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search for a city...');

    // Clear button should not be visible initially
    await expect(page.getByRole('button', { name: 'Clear search' })).not.toBeVisible();

    // Type something
    await searchInput.fill('New York');

    // Clear button should now be visible
    const clearButton = page.getByRole('button', { name: 'Clear search' });
    await expect(clearButton).toBeVisible();

    // Click clear button
    await clearButton.click();

    // Input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('temperature unit toggle works', async ({ page }) => {
    await page.goto('/');

    // Search for a location first
    const searchInput = page.getByPlaceholder('Search for a city...');
    await searchInput.fill('Tokyo');

    // Wait for and click result (longer timeout for CI)
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();

    // Wait for weather to load
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 15000 });

    // Click Fahrenheit
    await page.getByRole('button', { name: 'Fahrenheit' }).click();

    // Wait for toggle state to update
    await expect(page.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  test('demo locations are seeded on first visit', async ({ page }) => {
    await page.goto('/');

    // Demo data should be seeded, showing saved locations
    // The app seeds London, New York, Tokyo by default
    await expect(page.getByText('Saved Locations')).toBeVisible({ timeout: 10000 });

    // Should have at least one saved location from demo data
    await expect(page.locator('[aria-label*="Select"]').first()).toBeVisible();
  });

  test('keyboard navigation works in search', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search for a city...');
    await searchInput.fill('Paris');

    // Wait for results (longer timeout for CI)
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 15000 });

    // Press arrow down to select first item
    await searchInput.press('ArrowDown');

    // First option should be highlighted
    const firstOption = page.getByRole('option').first();
    await expect(firstOption).toHaveAttribute('aria-selected', 'true');

    // Press Escape to close
    await searchInput.press('Escape');
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });

  test('error message shows for invalid search', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search for a city...');

    // Type a nonsense query that won't match any city
    await searchInput.fill('xyznonexistent123');

    // Wait for "no results" message (longer timeout for CI)
    await expect(page.getByText(/No cities found/)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Settings Page', () => {
  test('settings page loads', async ({ page }) => {
    await page.goto('/settings');

    // Check settings heading is visible
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
});

test.describe('API Route', () => {
  test('weather API returns data for valid coordinates', async ({ request }) => {
    const response = await request.get('/api/weather?lat=51.51&lon=-0.13&unit=celsius');

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('current');
    expect(data.data).toHaveProperty('hourly');
    expect(data.data).toHaveProperty('daily');
  });

  test('weather API returns error for invalid coordinates', async ({ request }) => {
    const response = await request.get('/api/weather?lat=invalid&lon=-0.13');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INVALID_REQUEST');
  });

  test('weather API returns error for out-of-range latitude', async ({ request }) => {
    const response = await request.get('/api/weather?lat=100&lon=0');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.details).toContain('Latitude');
  });

  test('weather API includes rate limit headers', async ({ request }) => {
    const response = await request.get('/api/weather?lat=51.51&lon=-0.13');

    expect(response.headers()['x-ratelimit-remaining']).toBeDefined();
  });
});
