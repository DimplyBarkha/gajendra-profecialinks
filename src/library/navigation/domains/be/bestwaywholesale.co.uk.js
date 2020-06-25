module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bestwaywholesale.co.uk',
    country: 'UK',
    store: 'bestwaywholesale',
  },
  // @ts-ignore
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const clickPopup = async function (context) {
      const allowCookies = await context.evaluate((selector) => !!document.querySelector(selector), 'a.cc-primary-btn');

      if (allowCookies) {
        await context.click('a.cc-primary-btn');
      }

      const deliveryType = await context.evaluate((selector) => !!document.querySelector(selector), '#fulf-select-D');

      if (deliveryType) {
        await context.click('#fulf-select-D');
      }
      await context.waitForNavigation();
    };
    const redirectToProductPage = async function (context) {
      const isProductPage = await context.evaluate((selector) => !!document.querySelector(selector), 'div.productpagedetail');
      if (!isProductPage) {
        await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
        await context.waitForNavigation();
        await clickPopup(context);
      }
    };

    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    await context.waitForSelector('div.productpagedetail', { timeout: 50000 });

    const isLoggedIn = await context.evaluate((selector) => !!document.querySelector(selector), 'p.prodlogin');

    if (!isLoggedIn) {
      console.log('Aleady logged in');
      await clickPopup(context);
      return;
    }

    await clickPopup(context);

    await context.goto('https://www.bestwaywholesale.co.uk/login-auth', { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    await context.waitForNavigation();

    const loginLoaded = await context.evaluate((selector) => !!document.querySelector(selector), '#account_number');

    if (!loginLoaded) {
      await redirectToProductPage(context);
      return;
    }

    const ACCOUNT_ID = '804999333';
    await context.setInputValue('#account_number', ACCOUNT_ID);

    await context.click('input[name="submit"]');
    await context.waitForNavigation();
    await context.waitForFunction(function () {
      // @ts-ignore
      return document.querySelector('#username').value === 'supplierlogin@bestway.co.uk';
    }, { timeout: 10000 });
    const ACCOUNT_PWD = 'bestway804';
    await context.setInputValue('#password', ACCOUNT_PWD);
    await context.click('#btn-login');
    await context.waitForNavigation();

    await clickPopup(context);
    await redirectToProductPage(context);
  },
};
