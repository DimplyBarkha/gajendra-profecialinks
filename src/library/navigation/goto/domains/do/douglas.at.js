
module.exports = {
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
      await context.waitForSelector('.uc-banner-content', { timeout });
      await context.click('#uc-btn-accept-banner');
      console.log('Cookies accepted.');
    } catch (e) {
      try {
        await context.waitForSelector('.uc-overlay', { timeout });
        await context.click('.uc-overlay button[class*="primary"]');
        console.log('Cookies accepted.');
      } catch (e) {
        console.log('No cookie banner present');
      }
    }
  },
};
