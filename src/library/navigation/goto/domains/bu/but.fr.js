
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'but.fr',
    timeout: 90000,
    country: 'FR',
    store: 'but',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  },
};
