async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { username, password } = inputs;
  const { usernameSelector, passwordSelector, buttonSelector, loggedInSelector } = parameters;
  if (context.click('a[id="ctl00_ctl06_lbEnterSiteYes"]')) {
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  }
  if (context.click('a[id="ctl00_cookiescontinuebutton"]')) {
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  }
  if (context.click('div[class="divloginregistercontainer"] a[class="sitetoplink not-logged-in"]')) {
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
    if (usernameSelector) {
      await context.setInputValue(usernameSelector, username);
    }
    if (passwordSelector) {
      await context.setInputValue(passwordSelector, password);

    }
  }
  await context.click('button[type="button"]');
  await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  await context.evaluate(function () {
    document.forms[0].submit();
  });
  await context.waitForNavigation({ timeout: 100000, waitUntil: 'load' });
}
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'matthewclarklive.com',
    usernameSelector: 'input[class="username-auth-input form-control"]',
    passwordSelector: 'input[class="password-auth-input form-control"]',
    buttonSelector: 'button[type="button"]:nth-child(1)',
    loggedInSelector: 'body',
    country: 'UK',
    store: 'matthewclarklive',
    zipcode: '',
  },
  implementation,
};