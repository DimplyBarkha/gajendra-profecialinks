module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'drankdozijn.nl',
    timeout: 50000,
    country: 'NL',
    store: 'drankdozijn',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('#leeftijd-wrapper', { timeout: 10000 });
      await context.clickAndWaitForNavigation('button[name="naar_drankdozijn"]', { timeout: 20000 });
    } catch (err) {
      console.log('cookies window not appeared');
    }
  },
};
