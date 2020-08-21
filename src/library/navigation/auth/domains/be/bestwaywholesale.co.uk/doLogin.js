
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { username, password } = inputs;
  const { usernameSelector, passwordSelector, buttonSelector, loggedInSelector } = parameters;

  console.log('Username' + username);
  await context.setInputValue(usernameSelector, username);
  await context.click(buttonSelector);
  if (loggedInSelector) {
    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 10000 }, loggedInSelector);
  }
  await context.setInputValue(passwordSelector, password);
  await context.click('#btn-login');
  await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  await context.evaluate(function () {
    document.forms[0].submit();
  });
  await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
}

module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'bestwaywholesale.co.uk',
    usernameSelector: '#account_number',
    passwordSelector: '#password',
    buttonSelector: 'input[name="submit"]',
    loggedInSelector: '#username',
    country: 'UK',
    store: 'bestwaywholesale',
    zipcode: '',
  },
  implementation,
};
