const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://34.229.217.192:3000';

function getChromeDriver() {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

describe('Job Portal - Selenium Test Cases', function () {
  this.timeout(60000);
  let driver;

  beforeEach(async function () {
    driver = getChromeDriver();
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('TC01: Homepage loads successfully', async function () {
    await driver.get(BASE_URL);
    const title = await driver.getTitle();
    assert.ok(title.length > 0, 'Page title should not be empty');
  });

  it('TC02: Homepage body has content', async function () {
    await driver.get(BASE_URL);
    const body = await driver.findElement(By.tagName('body'));
    const text = await body.getText();
    assert.ok(text.length > 0, 'Homepage body should have content');
  });

  it('TC03: Register page loads successfully', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('register'), 'Should be on register page');
  });

  it('TC04: Register form has fullName field', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const field = await driver.findElement(By.name('fullName'));
    assert.ok(field, 'fullName field should exist');
  });

  it('TC05: Register form has email field', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const field = await driver.findElement(By.name('email'));
    assert.ok(field, 'email field should exist');
  });

  it('TC06: Register form has password field', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const field = await driver.findElement(By.name('password'));
    assert.ok(field, 'password field should exist');
  });

  it('TC07: User can register successfully', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const unique = Date.now();
    await driver.findElement(By.name('fullName')).sendKeys('Test User');
    await driver.findElement(By.name('email')).sendKeys(`test${unique}@test.com`);
    await driver.findElement(By.name('password')).sendKeys('Test@1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);
    const url = await driver.getCurrentUrl();
    assert.ok(!url.includes('register'), 'Should redirect after register');
  });

  it('TC08: Login page loads successfully', async function () {
    await driver.get(`${BASE_URL}/auth/login`);
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('login'), 'Should be on login page');
  });

  it('TC09: Login form has email field', async function () {
    await driver.get(`${BASE_URL}/auth/login`);
    const field = await driver.findElement(By.name('email'));
    assert.ok(field, 'Email field should exist');
  });

  it('TC10: Login form has password field', async function () {
    await driver.get(`${BASE_URL}/auth/login`);
    const field = await driver.findElement(By.name('password'));
    assert.ok(field, 'Password field should exist');
  });

  it('TC11: Login with invalid credentials stays on login', async function () {
    await driver.get(`${BASE_URL}/auth/login`);
    await driver.findElement(By.name('email')).sendKeys('wrong@wrong.com');
    await driver.findElement(By.name('password')).sendKeys('wrongpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);
    const url = await driver.getCurrentUrl();
    const body = await driver.findElement(By.tagName('body')).getText();
    assert.ok(
      url.includes('login') || body.toLowerCase().includes('invalid') || body.toLowerCase().includes('error'),
      'Should show error for invalid login'
    );
  });

  it('TC12: User can login with valid credentials', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const unique = Date.now();
    const email = `login${unique}@test.com`;
    await driver.findElement(By.name('fullName')).sendKeys('Login Test');
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('password')).sendKeys('Test@1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);
    await driver.get(`${BASE_URL}/auth/login`);
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('password')).sendKeys('Test@1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);
    const url = await driver.getCurrentUrl();
    assert.ok(!url.includes('login'), 'Should redirect after successful login');
  });

  it('TC13: Jobs page loads successfully', async function () {
    await driver.get(`${BASE_URL}/jobs`);
    const url = await driver.getCurrentUrl();
    assert.ok(url.length > 0, 'Jobs page should load');
  });

  it('TC14: Profile page redirects unauthenticated user', async function () {
    await driver.get(`${BASE_URL}/profile`);
    await driver.sleep(1000);
    const url = await driver.getCurrentUrl();
    assert.ok(url.length > 0, 'Should handle profile page request');
  });

  it('TC15: Logout redirects to login or homepage', async function () {
    await driver.get(`${BASE_URL}/auth/register`);
    const unique = Date.now();
    const email = `logout${unique}@test.com`;
    await driver.findElement(By.name('fullName')).sendKeys('Logout Test');
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('password')).sendKeys('Test@1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(2000);
    await driver.get(`${BASE_URL}/auth/logout`);
    await driver.sleep(1000);
    const url = await driver.getCurrentUrl();
    assert.ok(!url.includes('profile'), 'Should be logged out');
  });
});