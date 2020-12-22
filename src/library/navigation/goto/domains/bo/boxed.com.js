
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boxed.com',
    timeout: 90000,
    country: 'US',
    store: 'boxed',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  },
};
