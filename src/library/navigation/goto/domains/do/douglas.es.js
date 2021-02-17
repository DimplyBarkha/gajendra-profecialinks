
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'douglas.es',
    country: 'ES',
    store: 'douglas',
    timeout: 60000,
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (url !== 'https://www.douglas.es') {
      try {
        await context.waitForSelector('.uc-banner-content, .uc-overlay', { timeout });
        await context.click('#uc-btn-accept-banner, .uc-overlay button[class*="primary"]');
        console.log('Cookies accepted.');
      } catch (e) {
        console.log('No cookie banner present');
      }
    }
  },
};
