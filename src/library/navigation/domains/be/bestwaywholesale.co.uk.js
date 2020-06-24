
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bestwaywholesale.co.uk',
    country: 'UK',
    store: 'bestwaywholesale',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    await context.goto(url, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });

    await context.waitForSelector('div.productpagedetail', { timeout: 50000 });

    const isLoggedIn = await context.evaluate((selector) => !!document.querySelector(selector), 'a.signin');

    if (!isLoggedIn) {
      console.log('Aleady logged in');
      return;
    }

    const allowCookies = await context.evaluate((selector) => !!document.querySelector(selector), 'a.cc-primary-btn');

    if(allowCookies) {
      await context.click('a.cc-primary-btn');
    }

    await context.clickAndWaitForNavigation('a.signin', {}, { timeout: 50000, waitUntil: 'load', checkBlocked: true  });

    const loginLoaded = await context.evaluate((selector) => !!document.querySelector(selector), '#account_number');

    if(!loginLoaded) {
      return;
    }

    await context.evaluate(async function () {
      const ACCOUNT_ID = '804999333';
      document.getElementById('account_number').value = ACCOUNT_ID;
    });

    await context.clickAndWaitForNavigation('input[name="submit"]', {}, { timeout: 50000, waitUntil: 'load' });

    await context.evaluate(async function () {
      const ACCOUNT_PWD = 'bestway804';
      document.getElementById('password').value = ACCOUNT_PWD;
    });
    await context.clickAndWaitForNavigation('#btn-login', {}, { timeout: 50000, waitUntil: 'load', checkBlocked: true  });

    const isProductPage = await context.evaluate((selector) => !!document.querySelector(selector), 'div.productpagedetail');

    if(!isProductPage) {
      await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    }
  },
};
