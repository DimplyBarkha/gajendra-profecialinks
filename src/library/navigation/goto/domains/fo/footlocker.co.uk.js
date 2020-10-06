module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'footlocker.co.uk',
    country: 'UK',
    store: 'footlocker',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
