
mmodule.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'douglas.at',
    timeout: 30000,
    store: 'douglas',
    country: 'AT',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('.uc-banner-content', { timeout: 10000 });
      const cookieBanner = await context.evaluate(() => {
        return document.querySelector('.uc-banner-content');
      });
      if (cookieBanner) {
        await context.click('#uc-btn-accept-banner');
        console.log('Cookies accepted.');
      }
    } catch (e) {
      console.log(e.message);
    }
  },
};

