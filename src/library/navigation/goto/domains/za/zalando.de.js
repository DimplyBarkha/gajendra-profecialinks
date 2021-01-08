
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'zalando.de',
    timeout: 50000,
    country: 'DE',
    store: 'zalando',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  },
};
