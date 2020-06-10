
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bestwaywholesale.co.uk',
    country: 'UK',
    store: 'bestwaywholesale',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const loginPageResponse = await context.goto('https://www.bestwaywholesale.co.uk/login-auth', {
      timeout: 10000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
    });

    if (loginPageResponse.status !== 200) {
      console.log('Blocked: ' + loginPageResponse.status);
      console.log('Loading the product page without login');
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      return;
    }
    const hasAccountInput= await context.evaluate((selector) => !!document.querySelector(selector), '#account_number');
    if (!hasAccountInput) {
      console.log('Aleady logged in');
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      return;
    }
    await context.evaluate(async function () {
      const ACCOUNT_ID = '804999333';
      const ele = document.getElementById('account_number');
      document.getElementById('account_number').value = ACCOUNT_ID;
    });

    await context.clickAndWaitForNavigation('input[name="submit"]', {}, { timeout: 30000, waitUntil: 'load' });
    await context.evaluate(async function () {
      const ACCOUNT_PWD = 'bestway804';
      document.getElementById('password').value = ACCOUNT_PWD;
    });
    await context.clickAndWaitForNavigation('#btn-login', {}, { timeout: 30000 });
    await context.waitForSelector('div.main', { timeout: 50000 });
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
