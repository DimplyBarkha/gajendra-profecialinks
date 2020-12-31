async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { username, password, zipcode, storeId } = inputs;
  const { usernameSelector, passwordSelector, buttonSelector, loggedInSelector } = parameters;

  if (context.click('button[type="button"]')) {
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
    if (usernameSelector) {
      await context.setInputValue(usernameSelector, username);
    }
    if (passwordSelector) {
      await context.setInputValue(passwordSelector, password);
    }
  }
  await context.click('button[type="submit"]');

  await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  await context.evaluate(function () {
    //context.setInputValue(zipcode).value="32821";
    //context.setInputValue(storeId).value="57";
    document.forms[0].submit();
  });
  if (loggedInSelector) {
    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 10000 }, loggedInSelector);
  }
  await context.waitForNavigation({ timeout: 100000, waitUntil: 'load' });
}
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'instacart.com',
    usernameSelector: '#nextgen-authenticate\\.all\\.log_in_email',
    passwordSelector: '#nextgen-authenticate\\.all\\.log_in_password',
    buttonSelector: '.rmq-a5d52242 div:nth-child(6) button',
    loggedInSelector: '#store',
    country: 'US',
    store: 'instacart_publix',
    zipcode: '32821',
  },
  implementation,
};