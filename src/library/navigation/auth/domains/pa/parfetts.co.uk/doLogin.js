async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { username, password } = inputs;
  const { usernameSelector, passwordSelector, buttonSelector, loggedInSelector } = parameters;
  await context.setInputValue(usernameSelector, username);
  await context.setInputValue(passwordSelector, password);
  await context.waitForSelector(('div[class*="row d-flex"] > div > button'), { timeout: 20000 });
  await context.click(buttonSelector);
  await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  if (loggedInSelector) {
    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, loggedInSelector);
  }
}
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'parfetts.co.uk',
    usernameSelector: 'input[name="email"]',
    passwordSelector: 'input[name="password"]',
    buttonSelector: 'div[class*="row d-flex"] > div > button',
    loggedInSelector: 'div[class="account-section-cards row"]',
    country: 'UK',
    store: 'parfetts',
    zipcode: '',
  },
  implementation,
};
